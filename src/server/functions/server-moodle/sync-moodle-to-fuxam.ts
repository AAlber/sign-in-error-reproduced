import cuid from "cuid";
import dayjs from "dayjs";
import { MoodleActionsValidator } from "@/src/client-functions/client-moodle-integration/moodle-actions-validator";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../../db/client";
import { createLayerOrCourseAndPropagateRoles } from "../server-administration";
import { createAppointment } from "../server-appointment";
import { createRole } from "../server-role";
import { createManyInstitutionUsers } from "../server-user-mgmt";
import { getLayersOfInstitution, getUsersOfOrganization } from "./common";
import type { MoodleWebServiceClient } from "./moodle-client";
import type { MoodleApiCategoryResponse } from "./types";

export async function syncMoodleUsersToFuxam(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
) {
  const moodleUsers = await moodleClient.getUsers();
  const fuxamUsers = await getUsersOfOrganization(institutionId);

  const fuxamUserEmails = fuxamUsers.map((u) => u.email);
  const newUsers = moodleUsers.users.filter(
    (u) => u.username !== "guest" && !fuxamUserEmails.includes(u.email),
  );

  return await createManyInstitutionUsers(
    institutionId,
    newUsers.map((i) => ({ email: i.email, role: "member", name: i.fullname })),
  );
}

export async function syncMoodleCoursesToFuxam(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
  userId: string,
) {
  /**
   * 1. Convert moodle categories to fuxamLayers
   * 2. Convert moodle Courses to fuxamCourseLayers
   * 3. sync existing students to new fuxamCourseLayers
   */

  const moodleCategoryIdToFuxamLayerIdMapping =
    await _syncMoodleCategoriesToFuxamLayers(
      institutionId,
      userId,
      moodleClient,
    );

  const moodleCourseIdToFuxamCourseLayerIdMapping =
    await _syncMoodleCoursesToFuxamCourses({
      institutionId,
      moodleCategoryIdToFuxamLayerIdMapping,
      moodleClient,
      userId,
    });

  const { functions } = await moodleClient.getSiteInfo();
  const moodleValidator = new MoodleActionsValidator(
    functions.map(({ name }) => name),
  );

  if (moodleValidator.canEnrollUsers) {
    await _syncMoodleCourseUsersToFuxam(
      moodleCourseIdToFuxamCourseLayerIdMapping,
      institutionId,
      moodleClient,
    );
  }
}

export async function convertMoodleEventsToFuxamAppointments(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
  userId: string,
) {
  // As of the moment, we only sync Moodle Events of `course` eventType, all other eventTypes are ignored
  const moodleCourses = await moodleClient.getCourses();
  const fuxamLayers = await getLayersOfInstitution(institutionId, true);
  const moodleCourseEvents = await moodleClient.getCalendarEvents(
    moodleCourses.map((i) => i.id),
  );

  const moodleCourseIdToFuxamLayerIdMapping = new Map<number, string>();
  moodleCourses.forEach((course) => {
    const fuxamLayer = fuxamLayers.find(
      (i) =>
        i.id === course.idnumber ||
        `moodle-course-${course.id}` === i.externalId,
    );

    if (fuxamLayer) {
      moodleCourseIdToFuxamLayerIdMapping.set(course.id, fuxamLayer.id);
    }
  });

  return await Promise.all(
    // will sync including past events
    moodleCourseEvents.events
      .map((ev) => {
        const fuxamLayerId = moodleCourseIdToFuxamLayerIdMapping.get(
          ev.courseid,
        );
        if (!fuxamLayerId) return;
        const dateTime = new Date(ev.timestart * 1000); // moodle dateTime in seconds convert to ms
        let duration = ev.timeduration / 60;

        // check if event will end on nextday, if so, set duration to last until the last minute of day
        const eod = dayjs(dateTime).endOf("D");
        const endOfEvent = dayjs(dateTime).add(duration, "minutes");
        const eodDiff = eod.diff(endOfEvent);
        if (eodDiff < 0) duration = eod.diff(dayjs(dateTime), "minutes");

        return createAppointment(
          {
            layerIds: [fuxamLayerId],
            provider: "custom",
            title: ev.name,
            address: "Moodle Event",
            organizerIds: [userId],
            userAttendeeIds: [],
            userGroupAttendeeIds: [],
            duration,
            isHybrid: false,
            notes: ev.description,
            isOnline: true,
            onlineAddress: "Moodle Event",
            dateTime: dateTime.toISOString(),
          },
          userId,
          institutionId,
        );
      })
      .filter(filterUndefined),
  );
}

/**************************** PRIVATE FUNCTIONS BELOW *************************/

async function _syncMoodleCategoriesToFuxamLayers(
  institutionId: string,
  userId: string,
  moodleClient: MoodleWebServiceClient,
) {
  /**
   * Before we sync moodle courses, we need to know where to put the Courses in Fuxam side (AKA the layer's Parent)
   * in Fuxam Terminology, Moodle Category = the Parent Layer of a course
   */
  const moodleCategories = await moodleClient.getCategories();
  const fuxamLayers = await getLayersOfInstitution(institutionId, false);

  const newMoodleCategories = moodleCategories.filter((category) => {
    const exists = fuxamLayers.some(
      (layer) => layer.externalId === `moodle-category-${category.id}`,
    );

    return !exists;
  });

  const moodleCategoryIdToFuxamLayerId = new Map<number, string>();

  const createFuxamLayerFromMoodleCategoryPromises = newMoodleCategories.map(
    (category) =>
      _createFuxamLayerFromMoodleCategory({
        institutionId,
        userId,
        moodleCategory: category,
        moodleCategoryIdToFuxamLayerId,
      }),
  );

  const updateFuxamLayerParentPromises = newMoodleCategories.map((category) =>
    _updateFuxamLayerParent(
      institutionId,
      category,
      moodleCategoryIdToFuxamLayerId,
    ),
  );

  // create the fuxamLayers first
  await Promise.all(createFuxamLayerFromMoodleCategoryPromises);
  // then update the fuxamLayer parentIds
  await Promise.all(updateFuxamLayerParentPromises);

  return moodleCategoryIdToFuxamLayerId;
}

function _createFuxamLayerFromMoodleCategory(args: {
  institutionId: string;
  userId: string;
  moodleCategory: MoodleApiCategoryResponse;
  moodleCategoryIdToFuxamLayerId: Map<number, string>;
}) {
  const {
    institutionId,
    moodleCategory,
    moodleCategoryIdToFuxamLayerId,
    userId,
  } = args;

  const layerId = cuid();
  moodleCategoryIdToFuxamLayerId.set(moodleCategory.id, layerId);

  return createLayerOrCourseAndPropagateRoles({
    id: layerId,
    institutionId,
    isCourse: false,
    name: `Moodle - ${moodleCategory.name}`,
    parentId: institutionId,
    userId,
    externalId: `moodle-category-${moodleCategory.id}`,
  });
}

function _updateFuxamLayerParent(
  institutionId: string,
  moodleCategory: MoodleApiCategoryResponse,
  moodleCategoryIdToFuxamLayerId: Map<number, string>,
) {
  const layerIdToUpdate = moodleCategoryIdToFuxamLayerId.get(moodleCategory.id);
  if (!layerIdToUpdate) return;

  const layerParent = moodleCategoryIdToFuxamLayerId.get(moodleCategory.parent);

  return prisma.layer.update({
    where: {
      id: layerIdToUpdate,
    },
    data: {
      parent_id: layerParent ?? institutionId,
    },
  });
}

async function _syncMoodleCoursesToFuxamCourses(args: {
  institutionId: string;
  userId: string;
  moodleCategoryIdToFuxamLayerIdMapping: Map<number, string>;
  moodleClient: MoodleWebServiceClient;
}) {
  const {
    institutionId,
    moodleCategoryIdToFuxamLayerIdMapping,
    moodleClient,
    userId,
  } = args;

  const moodleCourses = await moodleClient.getCourses();
  const fuxamCourses = await getLayersOfInstitution(institutionId, true);

  const newMoodleCourses = moodleCourses.filter((course) => {
    const exist = fuxamCourses.some(
      (i) => i.externalId === `moodle-course-${course.id}`,
    );
    return !exist;
  });

  const moodleCourseIdToFuxamCourseLayerIdMapping = new Map<number, string>();

  await Promise.all(
    newMoodleCourses.map((course) => {
      const id = cuid();
      moodleCourseIdToFuxamCourseLayerIdMapping.set(course.id, id);
      return createLayerOrCourseAndPropagateRoles({
        id,
        institutionId,
        isCourse: true,
        name: course.fullname || course.displayname || course.shortname || "",
        userId,
        start: !!course.startdate
          ? new Date(course.startdate * 1000)
          : undefined,
        end: !!course.enddate ? new Date(course.enddate * 1000) : undefined,
        parentId:
          moodleCategoryIdToFuxamLayerIdMapping.get(course.categoryid) ??
          institutionId,
        externalId: `moodle-course-${course.id}`,
      });
    }),
  );

  return moodleCourseIdToFuxamCourseLayerIdMapping;
}

async function _syncMoodleCourseUsersToFuxam(
  moodleCourseIdToFuxamCourseLayerIdMapping: Map<number, string>,
  institutionId: string,
  moodleClient: MoodleWebServiceClient,
) {
  const moodleCourses = await moodleClient.getCourses();

  const moodleCoursesWithUsers = await Promise.all(
    moodleCourses.map(async (course) => {
      const users = await moodleClient.getCourseUsers(course.id);
      return {
        courseId: course.id,
        courseName: course.fullname,
        users,
      };
    }),
  );

  const moodleUsersFromCourses = moodleCoursesWithUsers
    .flatMap((u) => u?.users)
    .filter(filterUndefined);

  const existingFuxamUsers = await prisma.role.findMany({
    where: {
      institutionId,
      user: {
        email: { in: moodleUsersFromCourses.map((u) => u.email) },
      },
    },
    select: { active: true, userId: true, user: { select: { email: true } } },
    distinct: "userId",
  });

  // create roles for the user to the new courseLayer
  return await Promise.all(
    moodleCoursesWithUsers.map((course) => {
      const fuxamLayer = moodleCourseIdToFuxamCourseLayerIdMapping.get(
        course.courseId,
      );

      if (!fuxamLayer) return;

      const existingFuxamUsersFromCourse = course.users
        .map((u) => existingFuxamUsers.find((i) => i.user.email === u.email))
        .filter(filterUndefined);

      return existingFuxamUsersFromCourse.map((u) =>
        createRole({
          active: u.active,
          institutionId,
          layerId: fuxamLayer,
          role: "member",
          userId: u.userId,
        }),
      );
    }),
  );
}
