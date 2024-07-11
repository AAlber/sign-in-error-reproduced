import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import { streamChat } from "@/src/server/functions/server-chat";
import i18n from "@/src/translations/i18n";
import type {
  SimpleCourse,
  SimpleCourseWithDuration,
  SimpleCourseWithUserRole,
} from "@/src/types/course.types";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import type {
  CourseLayerUserHasAccessTo,
  GetUserGradesProps,
  LayerUserHasAccessTo,
  UserGrade,
} from "@/src/types/user.types";
import type { StripeAccountInfo, UserData } from "@/src/types/user-data.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import {
  executeTransactionAndTrackTime,
  filterUndefined,
} from "@/src/utils/utils";
import { boostedPrisma, prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { getSimpleLayer } from "./server-administration";
import { getSettingValues } from "./server-institution-settings";
import { getHighestRoleOfUser, isUserActiveInInstitution } from "./server-role";
import { getUserDataStripeAccountInfo } from "./server-stripe";
import { filterUniqueBy } from "./server-utils";

export async function getUserData(userId: string): Promise<UserData> {
  return executeTransactionAndTrackTime(
    async () => {
      sentry.setContext("user", { userId });
      sentry.addBreadcrumb({ message: "Finding user...", data: { userId } });
      const user = await findUser(userId);
      if (!user) {
        sentry.addBreadcrumb({
          message: "User not found. Creating with clerk",
          data: { userId },
        });
        const newUser = await createNewUserFromClerkWithId(userId);
        sentry.addBreadcrumb({ message: "User created", data: { newUser } });
        return assembleUserData(newUser, null, false, null, {}, null);
      }

      sentry.addBreadcrumb({
        message: "Generating get stream token...",
        data: { user },
      });
      const token = generateUserToken(userId);

      // If the user is part of an institution, perform the next set of operations in parallel.
      if (user.institution) {
        const [highestRole, isActive, settings, stripeAccountInfo] =
          await Promise.all([
            getHighestRoleOfUser(userId, user.institution.id),
            isUserActiveInInstitution(userId, user.institution.id),
            getSettingValues(
              user.institution.id,
              publicSettingsKeysToFetchForEveryone,
            ),
            getUserDataStripeAccountInfo(user.institution.id),
          ]);

        sentry.addBreadcrumb({
          message: "Assembling user data...",
          data: {
            user,
            token,
            isActive,
            highestRole,
            settings,
            stripeAccountInfo,
          },
        });
        return assembleUserData(
          user,
          token,
          isActive,
          highestRole,
          settings,
          stripeAccountInfo,
        );
      }

      // If the user is not part of an institution, return the user data with no additional processing.
      return assembleUserData(user, token, false, null, {}, null);
    },
    {
      errorThreshold: 2000,
      warnThreshold: 1000,
      sentryMessage: "Getting user data",
      extraData: { userId },
    },
  );
}

const publicSettingsKeysToFetchForEveryone: (keyof InstitutionSettings)[] = [
  "addon_artificial_intelligence",
  "addon_lms_feedbacks",
  "addon_room_management",
  "addon_support_contact",
  "addon_user_profiles",
  "addon_ects_points",
  "addon_schedule_monitor",
  "feedback_content_blocks",
  "feedback_course",
  "profile_information_required",
  "support_contact_userid",
  "communication_course_chat",
  "communication_messaging",
  "schedule_monitor_show_empty_columns",
  "schedule_monitor_split_every",
  "appointment_default_duration",
  "appointment_organizer_display",
  "appointment_default_offline",
  "addon_peer_feedback",
  "statement_of_independence_required",
  "videoChatProviders",
];

const USER_SELECT_FIELDS = {
  id: true,
  email: true,
  name: true,
  image: true,
  language: true,
  currentInstitution: true,
  institution: {
    select: {
      id: true,
      name: true,
      logo: true,
      theme: true,
      customThemeHEX: true,
    },
  },
};

export async function findUser(userId: string) {
  return await boostedPrisma.user.findFirst({
    where: { id: userId },
    select: USER_SELECT_FIELDS,
    orderBy: { name: "asc" },
  });
}

function generateUserToken(userId: string) {
  return streamChat.createToken(userId);
}

async function assembleUserData(
  user: any,
  token: string | null,
  isActive: boolean,
  highestRole: string | null,
  settings: Partial<InstitutionSettings>,
  stripeAccountInfo: StripeAccountInfo | null,
) {
  const data: UserData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    language: user.language ?? "en",
    currentInstitutionId: user.currentInstitution,
    streamToken: token ?? "",
    institution: user.institution
      ? {
          ...user.institution,
          isUserInactive: !isActive,
          highestRole,
          hasModeratorRole:
            highestRole === "moderator" || highestRole === "admin",
          hasAdminRole: highestRole === "admin",
          institutionSettings: settings,
          stripeAccountInfo: stripeAccountInfo,
        }
      : null,
  };
  return data;
}

export async function createNewUserFromClerkWithId(userId: string) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const newUser = await createUserDatabaseEntry(
    userId,
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    )!.emailAddress,
    clerkUser.firstName + " " + clerkUser.lastName,
  );
  return newUser;
}

async function createUserDatabaseEntry(
  userId: string,
  email: string,
  name: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    await prisma.role.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        userId: userId,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        id: userId,
        name: name,
      },
      select: USER_SELECT_FIELDS,
    });

    return updatedUser;
  } else {
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: email,
        name: name,
      },
      select: USER_SELECT_FIELDS,
    });

    return newUser;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const userPromise = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return userPromise;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUsersByIds(userIds: string[]): Promise<SimpleUser[]> {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
  return users;
}

export async function getCurrentInstitutionId(userId: string) {
  const response = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: { currentInstitution: true },
  });

  if (!response) throw new Error("No current institution set for user");

  return response.currentInstitution;
}

export async function getCurrentInstitution(userId: string) {
  const response = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      institution: true,
    },
  });

  if (!response) throw new Error("No current institution set for user");

  return response.institution;
}

export async function searchCoursesUserHasSpecialAccessTo(
  userId: string,
  search: string,
) {
  const instituionId = await getCurrentInstitutionId(userId);
  if (!instituionId) throw new Error("No current institution set for user");
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: instituionId,
      role: {
        in: ["moderator", "admin"],
      },
      OR: [
        {
          layer: {
            course: {
              name: {
                contains: search,
              },
            },
          },
        },
        {
          layer: {
            id: search,
          },
        },
      ],
    },
    take: 5,
    select: {
      layerId: true,
      layer: {
        select: {
          name: true,
          displayName: true,
          course: {
            select: {
              id: true,
              name: true,
              icon: true,
              layer_id: true,
            },
          },
        },
      },
    },
  });

  // remove duplicates
  const filteresRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.layerId === role.layerId),
  );

  if (!filteresRoles) return [];
  return filteresRoles.map((role) => {
    return {
      ...role.layer.course,
      name: role.layer.name,
    };
  });
}

export async function getLayersUserHasSpecialAccessTo(
  userId: string,
): Promise<LayerUserHasAccessTo[]> {
  const specialAccessRoles: Role[] = ["admin", "moderator", "educator"];
  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) throw new Error("No current institution set for user");
  const roles = await prisma.role.findMany({
    where: {
      role: {
        in: specialAccessRoles,
      },
      userId,
      institutionId,
      layerId: {
        not: institutionId,
      },
    },
    select: {
      role: true,
      layerId: true,
    },
  });

  // remove duplicates
  const filteresRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.layerId === role.layerId),
  );
  if (!filteresRoles) return [];

  const layerIds = filteresRoles.map((role) => role.layerId);
  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: layerIds,
      },
    },
    select: {
      id: true,
      name: true,
      displayName: true,
      course: {
        select: {
          id: true,
          name: true,
          icon: true,
          iconType: true,
          layer_id: true,
        },
      },
    },
  });

  return layers.map((layer) => {
    return {
      ...layer,
      role: filteresRoles.find((role) => role.layerId === layer.id)!
        .role as Role,
    };
  });
}

export async function getLayersByLayerIds(userId: string, layerIds: string[]) {
  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) throw new Error("No current institution set for user");

  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: layerIds,
      },
    },
    select: {
      id: true,
      name: true,
      displayName: true,
      course: {
        select: {
          id: true,
          name: true,
          icon: true,
          iconType: true,
          layer_id: true,
        },
      },
    },
  });

  return layers;
}

export async function getTopMostLayersUserHasAccessTo(
  userId: string,
  institutionId: string,
): Promise<LayerUserHasAccessTo[]> {
  if (!institutionId) throw new Error("No current institution set for user");
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
      layerId: {
        not: institutionId,
      },
    },
    select: {
      role: true,
      layerId: true,
    },
  });

  // remove duplicates
  const filteresRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.layerId === role.layerId),
  );
  if (!filteresRoles) return [];

  const layerIds = filteresRoles.map((role) => role.layerId);
  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: layerIds,
      },
      institution_id: institutionId,
      parent_id: {
        notIn: layerIds,
      },
    },
    select: {
      id: true,
      name: true,
      displayName: true,
      course: {
        select: {
          id: true,
          name: true,
          icon: true,
          iconType: true,
          layer_id: true,
        },
      },
    },
  });

  return layers.map((layer) => {
    return {
      ...layer,
      role: filteresRoles.find((role) => role.layerId === layer.id)!
        .role as Role,
    };
  });
}

export async function getCoursesUserHasAccessTo(
  userId: string,
  institutionId?: string,
  includeOnlyActiveRoles = true,
): Promise<SimpleCourseWithDuration[]> {
  let instiId: string | null = institutionId || null;
  if (!institutionId) instiId = await getCurrentInstitutionId(userId);
  if (!instiId) return [];

  sentry.addBreadcrumb({
    message: "getCoursesUserHasAccessTo",
    data: { userId, institutionId },
  });

  const roles = await boostedPrisma.role.findMany({
    where: {
      userId: userId,
      institutionId: instiId,
      ...(includeOnlyActiveRoles ? { active: true } : {}),
      layer: {
        isCourse: true,
      },
    },
    select: {
      layerId: true,
      role: true,
      layer: {
        select: {
          start: true,
          end: true,
          name: true,
          contentBlocks: {
            select: { id: true, status: true },
          },
          appointmentLayers: {
            select: {
              id: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              description: true,
              icon: true,
              layer_id: true,
              iconType: true,
              bannerImage: true,
              color: true,
            },
          },
        },
      },
    },
    orderBy: {
      layer: {
        name: "asc",
      },
    },
  });

  const filteredRoles = filterUniqueBy(roles, "layerId");
  return filteredRoles
    .filter(
      (role) =>
        role.layer.course &&
        role.layer.course.name &&
        role.layer.course.layer_id,
    )
    .map((role) => {
      const studentContentBlockCount = role.layer.contentBlocks.filter(
        (block) =>
          block.status === "PUBLISHED" || block.status === "COMING_SOON",
      ).length;

      return {
        ...role.layer.course,
        totalContentBlockCount: role.layer.contentBlocks.length,
        publishedContentBlockCount: studentContentBlockCount,
        appointmentCount: role.layer.appointmentLayers.length,
        start: role.layer.start,
        end: role.layer.end,
        role: role.role as Role,
      } as SimpleCourseWithDuration;
    });
}

/** @deprecated */
export async function getUserProgressStats(userId: string) {
  const courses = await getCoursesUserHasAccessTo(userId);
  const promises = courses.map((course) => {
    if (!course) return null;
    // return getCourseStatus(userId, course.layer_id, course.role);
    return null;
  });

  const results = await Promise.all(promises);

  return {
    courseStats: results.filter(filterUndefined),
  };
}

export function getRoleLayersWithCourses(
  layers: CourseLayerUserHasAccessTo[],
): SimpleCourseWithUserRole[] {
  // Make course prop of layer non nullable
  type LayerWithNonNullableCourse = CourseLayerUserHasAccessTo & {
    layer: { course: SimpleCourse };
  };

  return layers
    .filter(
      (layer): layer is LayerWithNonNullableCourse => !!layer?.layer.course,
    )
    .map(({ layer, role }) => {
      const role_ = role as Role;
      return { ...layer.course, role: role_ };
    });
}

export async function getUserCourseGrades({
  userId,
  layerId,
  institutionId,
}: GetUserGradesProps): Promise<UserGrade[]> {
  const query = prisma.contentBlockUserGrading.findMany;
  const statusQuery = prisma.contentBlockUserStatus.findMany;

  const gradesQuery = await query({
    where: { userId, layerId, institutionId },
    include: {
      block: true,
    },
  });

  const grades = await Promise.all(
    gradesQuery.map(async (grade) => ({
      grade: grade.ratingLabel,
      layerName: (await getSimpleLayer(grade.layerId))?.name || "Layer",
      name: grade.block?.name || "Block",
      status:
        (
          await statusQuery({
            where: { blockId: grade.blockId, userId, status: "REVIEWED" },
            select: { status: true },
          })
        )[0]?.status || undefined,
    })),
  );

  return grades.filter((g) => g.status === "REVIEWED"); // takes only "REVIEWED" gradings
}

/** Translating from backend, passing in userId makes this return a Promise */
export async function translateTextToUserPreferredLanguage(
  textToTranslate: string,
  userId: string,
  language: undefined,
  variables?: Record<string, string>,
): Promise<string>;
export function translateTextToUserPreferredLanguage(
  textToTranslate: string,
  userId?: undefined,
  language?: string,
  variables?: Record<string, string>,
): string;
export function translateTextToUserPreferredLanguage(
  textToTranslate: string,
  userId?: string,
  language?: string,
  variables?: Record<string, string>,
) {
  if (userId) {
    return getUser(userId).then((user) => {
      if (!user) throw new HttpError("User not found");
      i18n.changeLanguage(user.language);
      return i18n.t(textToTranslate, variables);
    });
  }

  i18n.changeLanguage(language);
  return i18n.t(textToTranslate, variables);
}

export async function getLayerIdsOfUser(
  userId: string,
  institutionId: string,
  isCourse = false,
) {
  const uniqueLayers = await prisma.role.findMany({
    where: {
      userId,
      institutionId,
      layerId: { not: institutionId },
      ...(isCourse ? { layer: { isCourse: true, isLinkedCourse: false } } : {}),
    },
    select: { layerId: true },
    distinct: ["layerId"],
  });

  return uniqueLayers.map((i) => i.layerId);
}
