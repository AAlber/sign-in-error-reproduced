import { MoodleActionsValidator } from "@/src/client-functions/client-moodle-integration/moodle-actions-validator";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../../db/client";
import { filterUniqueBy } from "../server-utils";
import { getLayersOfInstitution, getUsersOfOrganization } from "./common";
import type { MoodleWebServiceClient } from "./moodle-client";
import { MOODLE_STUDENT_ROLE_ID } from "./moodle-client";
import type {
  FuxamLayerType,
  MoodleApiCategoryResponse,
  MoodleApiCoursesResponse,
  MoodleCoursesPayload,
  MoodleEventsPayload,
  MoodleUsersPayload,
  NormalizedFuxamAppointmentType,
} from "./types";

export async function syncFuxamUsersToMoodle(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
) {
  /**
   * 1. GET existing moodle users
   * 2. GET fuxam users of this institution
   * 3. convert Fuxam users into a payload Moodle accepts
   */
  const moodleSiteUsers = await moodleClient.getUsers();
  const fuxamUsers = await getUsersOfOrganization(institutionId);
  let convertToMoodleUsers = fuxamUsers.map<MoodleUsersPayload>((user) => {
    return {
      email: user.email,
      firstname: user.firstName ?? "",
      lastname: user.lastName ?? "",
      password: "password",
      username: user.username ?? user.email,
    };
  });

  const currentMoodleUserEmails = moodleSiteUsers.users.map((u) => u.email);
  convertToMoodleUsers = convertToMoodleUsers.filter(
    (u) => !currentMoodleUserEmails.includes(u.email),
  );

  if (convertToMoodleUsers.length) {
    const result = await moodleClient.createUsers(convertToMoodleUsers);
    return result;
  }
}

export async function syncFuxamCoursesToMoodle(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
) {
  /**
   * 1. GET FuxamLayers and MoodleCourses
   * 2. Compare and extract only the New Courses
   */

  const fuxamLayers = await getLayersOfInstitution(institutionId);
  const parentLayers = fuxamLayers.filter((i) => !i.isCourse);

  // Sync and get the mapping of fuxamLayers to moodleCategory
  const fuxamLayerToMoodleIdMapping = await _syncFuxamLayersToMoodleCategories(
    parentLayers,
    moodleClient,
  );

  const moodleSiteCourses = await moodleClient.getCourses();
  const newCourses = _extractNewCourses(moodleSiteCourses, fuxamLayers);

  /**
   * A `categoryId` is required when creating courses in Moodle side (this is the LAYER in Fuxam terminology),
   * we fetch the existing fuxamLayer in Moodle site if it was previously synced, else put the course in default
   * category ID 0
   */
  let baseCategoryId = 0;
  if (!fuxamLayerToMoodleIdMapping.size) {
    const fuxamInstitutionFromMoodle = await moodleClient.getCategories([
      { key: "idnumber", value: institutionId },
    ]);

    if (fuxamInstitutionFromMoodle[0]?.id) {
      baseCategoryId = fuxamInstitutionFromMoodle[0].id;
    }
  }

  // abstract payload into a variable here to avoid from sending empty payload
  const coursesToCreate: MoodleCoursesPayload[] = newCourses
    .map((layer) => {
      if (!layer.parent_id) return;
      return {
        categoryid:
          fuxamLayerToMoodleIdMapping.get(layer.parent_id) ?? baseCategoryId, // moodle api will throw if no categoryId is not existing
        fullname: layer.course?.name ?? layer.name,
        shortname: `${layer.course?.name} - ${layer.id}`,
        idnumber: layer.id,
        summary: layer.course?.description ?? undefined,
        startdate: layer.start
          ? Math.floor(new Date(layer.start).getTime() / 1000)
          : undefined,
        enddate: layer.end
          ? Math.floor(new Date(layer.end).getTime() / 1000)
          : undefined,
      };
    })
    .filter(filterUndefined);

  // early return as moodle will throw if payload is empty, if moodle throws, this api will throw
  if (!coursesToCreate.length) return;
  await moodleClient.createCourses(coursesToCreate);

  const { functions } = await moodleClient.getSiteInfo();
  const validator = new MoodleActionsValidator(
    functions.map(({ name }) => name),
  );

  if (validator.canEnrollUsers && validator.canReadUsers) {
    await _syncFuxamCourseUsersToMoodleCourse(moodleClient);
  }
}

export async function syncFuxamAppointmentsToMoodle(
  moodleClient: MoodleWebServiceClient,
  institutionId: string,
) {
  /**
   * 1. GET existing moodleCourses
   * 2. Extract only fuxam courses that exists in Moodle
   * 3. If some Fuxam courses exist in Moodle, and if they have appointments sync the appointments
   *
   * we have 2 types of appointments, SERIES appointments, and REGULAR appointments
   * For SERIES appointments, just extract all appointment dates
   */
  const fuxamLayers = await getLayersOfInstitution(institutionId);
  const fuxamLayerIds = fuxamLayers.map((layer) => layer.id);
  const moodleCourses = await moodleClient.getCourses();

  const fuxamLayerIdToMoodleCourseIdMapping = new Map<string, number>();

  fuxamLayerIds.forEach((fuxamLayerId) => {
    const moodleCourse = moodleCourses.find((i) => i.idnumber === fuxamLayerId);
    if (!moodleCourse) return;
    fuxamLayerIdToMoodleCourseIdMapping.set(fuxamLayerId, moodleCourse.id);
  });

  const sortedFuxamAppointments =
    await _findManyAppointmentsAndSort(fuxamLayerIds);

  const seriesEventsPayload = _mapSeriesAppointmentsToMoodlePayload(
    sortedFuxamAppointments.series,
    fuxamLayerIdToMoodleCourseIdMapping,
  );

  const regularEventsPayload = _mapRegularAppointmentToMoodlePayload(
    sortedFuxamAppointments.regular,
    fuxamLayerIdToMoodleCourseIdMapping,
  );

  // if nothing to sync, return to avoid sending empty payload to moodle
  if (!seriesEventsPayload.length && !regularEventsPayload.length) return [];

  return await moodleClient.createEvents(
    seriesEventsPayload.concat(regularEventsPayload),
  );
}

/**************************** COURSE AND CATEGORIES PRIVATE FUNCTIONS ****************************/

function _extractNewCourses(
  moodleCourses: MoodleApiCoursesResponse[],
  layersOfInstitution: FuxamLayerType[],
) {
  /**
   * `idnumber` will contain the fuxam layerId if it was previously synced,
   * we check this so we can avoid duplicating courses on Moodle Side if it was already previously synced
   */
  const existingFuxamCoursesFromMoodle = moodleCourses
    .map((i) => i.idnumber)
    .filter(filterUndefined);

  // filter out new courses
  return layersOfInstitution
    .filter(({ isCourse }) => !!isCourse) // we only want to filter courses
    .filter((layer) => {
      if (existingFuxamCoursesFromMoodle.includes(layer.id!)) return false;
      const exists =
        moodleCourses.some(
          ({ shortname }) =>
            shortname === `${layer.course?.name} - ${layer.id}`,
        ) ||
        moodleCourses.some(
          ({ id }) => layer.externalId === `moodle-course-${id}`,
        );

      return !exists;
    });
}

async function _syncFuxamLayersToMoodleCategories(
  parentLayers: FuxamLayerType[],
  moodleClient: MoodleWebServiceClient,
) {
  const fuxamLayerToMoodleIdMapping = new Map<string, number>();
  const moodleCategoriesBefore = await moodleClient.getCategories();
  const newLayers = parentLayers.filter((layer) => {
    const exists = moodleCategoriesBefore.some(
      (category) =>
        category.idnumber === layer.id ||
        layer.externalId === `moodle-category-${category.id}`,
    );

    return !exists;
  });

  // if category already exist remove from rootParentLayers

  const fuxamParentLayerIds = newLayers.map((i) => i.id);

  if (!!newLayers.length) {
    await moodleClient.createCategory(
      newLayers.map((c) => ({
        description: `Fuxam - ${c.name}`,
        name: c.name,
        idnumber: c.id,
      })),
    );

    const moodleCategoriesAfter = await moodleClient.getCategories();

    // map categoryId to fuxamLayerId
    moodleCategoriesAfter.forEach((category) => {
      const id = fuxamParentLayerIds.find((i) => i === category.idnumber);
      if (id) {
        fuxamLayerToMoodleIdMapping.set(id, category.id);
      }
    });

    const moodleCategoriesToUpdate = moodleCategoriesAfter
      .map((category) =>
        _mapMoodleCategoryToParent(
          category,
          newLayers,
          fuxamLayerToMoodleIdMapping,
        ),
      )
      .filter(filterUndefined);

    if (!!moodleCategoriesToUpdate.length) {
      await moodleClient.updateCategories(moodleCategoriesToUpdate);
    }
  }

  return fuxamLayerToMoodleIdMapping;
}

function _mapMoodleCategoryToParent(
  moodleCategory: MoodleApiCategoryResponse,
  fuxamLayers: FuxamLayerType[],
  fuxamLayerToMoodleIdMapping: Map<string, number>,
) {
  const fuxamLayer = fuxamLayers.find((j) => j.id === moodleCategory.idnumber);
  if (!fuxamLayer) return;

  const parentId = fuxamLayerToMoodleIdMapping.get(fuxamLayer.parent_id!);
  if (!parentId) return;

  return {
    id: moodleCategory.id,
    parent: parentId,
  };
}

async function _syncFuxamCourseUsersToMoodleCourse(
  moodleClient: MoodleWebServiceClient,
) {
  const moodleCourses = await moodleClient.getCourses();
  const moodleUsers = await moodleClient.getUsers();

  const prismaLayers = await prisma.layer.findMany({
    where: { id: { in: moodleCourses.map((i) => i.idnumber) } },
  });

  const fuxamLayerIdToMoodleCourseIdMapping = new Map<string, number>();
  moodleCourses.forEach((c) => {
    fuxamLayerIdToMoodleCourseIdMapping.set(c.idnumber, c.id);
  });

  const roles = await prisma.role.findMany({
    where: { layerId: { in: prismaLayers.map((i) => i.id) } },
    select: { layerId: true, user: { select: { email: true } } },
  });

  const users = roles.map((i) => ({ layerId: i.layerId, ...i.user }));
  const uniqueUsers = filterUniqueBy(users, "email");

  await moodleClient.enrollUsers(
    uniqueUsers
      .map((u) => {
        const courseid = fuxamLayerIdToMoodleCourseIdMapping.get(u.layerId);
        if (!courseid) return;

        const user = moodleUsers.users.find((user) => user.email === u.email);
        if (!user) return;

        return {
          courseid,
          userid: user.id,
          roleid: MOODLE_STUDENT_ROLE_ID,
        };
      })
      .filter(filterUndefined),
  );
}

/**************************** APPOINTMENT PRIVATE FUNCTIONS ****************************/

function _mapSeriesAppointmentsToMoodlePayload(
  seriesAppointments: NormalizedFuxamAppointmentType[],
  fuxamLayerIdToMoodleCourseIdMapping: Map<string, number>,
): MoodleEventsPayload[] {
  const layerIdToAppointmentsMapping = seriesAppointments.reduce(
    (prev, curr) => {
      if (curr.layerId in prev) {
        prev[curr.layerId]!.push(curr);
      } else {
        prev[curr.layerId] = [curr];
      }

      return prev;
    },
    {} as { [layerId: string]: NormalizedFuxamAppointmentType[] },
  );

  const seriesEntries = Object.entries(layerIdToAppointmentsMapping) as [
    string,
    NormalizedFuxamAppointmentType[],
  ][];

  return seriesEntries
    .flatMap(([layerId, appointments]) => {
      const courseid = fuxamLayerIdToMoodleCourseIdMapping.get(layerId);
      if (!courseid) return;

      return appointments.map((appointment, idx) => {
        return {
          name: appointment.title,
          description: "Fuxam Appointment",
          courseid,
          eventtype: "course" as const,
          repeats: 0,
          sequence: idx,
          timeduration: (appointment.duration * 60).toString(), // fuxam duration in minutes, convert to seconds
          timestart: Math.floor(
            appointment.dateTime.getTime() / 1000,
          ).toString(), // convert to seconds
          visible: 1,
        };
      });
    })
    .filter(filterUndefined);
}

function _mapRegularAppointmentToMoodlePayload(
  appointments: NormalizedFuxamAppointmentType[],
  fuxamLayerIdToMoodleCourseIdMapping: Map<string, number>,
) {
  return appointments
    .map((appointment) => {
      const courseid = fuxamLayerIdToMoodleCourseIdMapping.get(
        appointment.layerId,
      );
      if (!courseid) return;
      return {
        name: appointment.title,
        courseid,
        description: "Fuxam Appointment",
        eventtype: "course" as const,
        repeats: 0,
        sequence: 0,
        timeduration: (appointment.duration * 60).toString(),
        timestart: Math.floor(appointment.dateTime.getTime() / 1000).toString(),
        visible: 1,
      };
    })
    .filter(filterUndefined);
}

async function _findManyAppointmentsAndSort(layerIds: string[]) {
  const fuxamAppointmentLayer = await prisma.appointmentLayer.findMany({
    where: {
      layerId: { in: layerIds },
      appointment: {
        dateTime: {
          // gte: new Date(), // sync all past and future appointments
        },
      },
    },
    include: { course: true, appointment: { include: { series: true } } },
  });

  const fuxamAppointments = fuxamAppointmentLayer.map(
    ({ course, layerId, appointment }) => {
      const { id, ...restOfAppointment } = appointment;
      return { course, layerId, appointmentId: id, ...restOfAppointment };
    },
  );

  // Sort date from old to new
  fuxamAppointments.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  return fuxamAppointments.reduce(
    (prev, curr) => {
      if (!!curr.seriesId) prev.series.push(curr);
      else prev.regular.push(curr);
      return prev;
    },
    {
      series: [],
      regular: [],
    } as {
      series: NormalizedFuxamAppointmentType[];
      regular: NormalizedFuxamAppointmentType[];
    },
  );
}
