import type { Invite, Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import type { InviteResponse } from "@/src/types/invite.types";
import type {
  InstitutionUserManagement,
  InstitutionUserManagementFilter,
  ServerCreateRole,
  ServerGetForAddingToLayer,
  ServerGetUsersWithAccess,
  ServerHasRolesInAtLeastOneLayer,
  ServerHasRoleWithAccess,
  UserWithAccess,
  UserWithActiveStatus,
} from "@/src/types/user-management.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { boostedPrisma, prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { getAmountOfUsersJoinedFromAccessPass } from "./server-access-passes/db-requests";
import {
  getChildrenIdsOfLayer,
  getLayerIdToLinkedCourseLayerIdMapping,
  getLinkedLayersOfCourse,
  getSimpleLayer,
} from "./server-administration";
import {
  createUserMembershipToChannel,
  removeUserMembershipFromChannel,
  removeUsersFromChannel,
} from "./server-chat/user-management";
import {
  getInstitutionUserDataFields,
  getInstitutionUserDataFieldValuesOfInstitution,
} from "./server-institution-user-data-field";
import { buildQuery } from "./server-utils";

export async function hasRole({
  userId,
  layerId,
  institutionId,
  role,
}: {
  userId: string;
  layerId: string;
  institutionId: string;
  role: string;
}) {
  const count = await prisma.role.count({
    where: { layerId, userId, role, institutionId },
  });

  return count > 0;
}

export async function isAdminOfInstitution(
  userId: string,
  institutionId: string,
) {
  Sentry.addBreadcrumb({
    message: "check isAdminOfInstitution",
    data: { userId, institutionId },
  });

  const count = await prisma.role.count({
    where: {
      userId,
      layerId: institutionId,
      institutionId: institutionId,
      role: "admin",
    },
  });

  return count > 0;
}

export async function getAdminsOfInstitution(institutionId: string) {
  const roles = await prisma.role.findMany({
    where: {
      institutionId,
      layerId: institutionId,
      role: "admin",
    },
    select: {
      user: true,
    },
  });
  return roles.map((role) => role.user);
}

export async function isAdminModeratorOrEducator({
  userId,
  layerId,
}: {
  userId: string;
  layerId: string;
}) {
  const layer = await prisma.layer.findFirst({
    where: { id: layerId },
    select: { parent_id: true, institution_id: true },
  });

  const targets = [layerId];
  if (layer?.parent_id) targets.push(layer.parent_id);

  const count = await prisma.role.count({
    where: {
      layerId: {
        in: targets,
      },
      userId: userId,
      institutionId: layer?.institution_id,
      role: {
        in: ["admin", "moderator", "educator"],
      },
    },
  });

  return count > 0;
}

export async function isAdminOrModerator({
  userId,
  layerId,
}: {
  userId: string;
  layerId: string;
}) {
  const layer = await prisma.layer.findFirst({
    where: { id: layerId },
    select: { parent_id: true, institution_id: true },
  });

  const targets = [layerId];
  if (layer?.parent_id) targets.push(layer.parent_id);

  const count = await prisma.role.count({
    where: {
      layerId: {
        in: targets,
      },
      userId: userId,
      institutionId: layer?.institution_id,
      role: {
        in: ["admin", "moderator"],
      },
    },
  });

  return count > 0;
}

export async function isAdmin({
  userId,
  institutionId,
}: {
  userId: string;
  institutionId: string;
}) {
  const count = await prisma.role.count({
    where: {
      layerId: institutionId,
      userId: userId,
      institutionId: institutionId,
      role: "admin",
    },
  });

  return count > 0;
}

export async function getMemberIdsOfInstitution(
  institutionId: string,
): Promise<string[]> {
  const members = await prisma.role.findMany({
    where: {
      institutionId: institutionId,
      role: {
        in: ["admin", "moderator", "educator", "member"],
      },
    },
    select: {
      userId: true,
    },
  });

  return members.map((member) => member.userId);
}

export async function hasAccessToLayer({
  userId,
  layerId,
}: {
  userId: string;
  layerId: string;
}) {
  const layer = await prisma.layer.findFirst({
    where: { id: layerId },
    select: { parent_id: true, institution_id: true },
  });

  const targets = [layerId];
  if (layer?.parent_id) targets.push(layer.parent_id);

  const count = await prisma.role.count({
    where: {
      layerId: {
        in: targets,
      },
      userId: userId,
      institutionId: layer?.institution_id,
    },
  });
  return count > 0;
}

export async function hasRoleAssociatedWithLayer({
  userId,
  layerId,
}: {
  userId: string;
  layerId: string;
}) {
  const layer = await prisma.layer.findFirst({
    where: { id: layerId },
    select: { institution_id: true },
  });

  const count = await prisma.role.count({
    where: {
      layerId: layerId,
      userId: userId,
      institutionId: layer?.institution_id,
    },
  });

  return count > 0;
}

export async function isMemberOfInstitution({
  userId,
  institutionId,
}: {
  userId: string;
  institutionId: string;
}) {
  const count = await prisma.role.count({
    where: {
      layerId: institutionId,
      userId: userId,
      institutionId: institutionId,
    },
  });

  return count > 0;
}

export async function hasRoles({
  userId,
  layerIds,
  role,
}: {
  userId: string;
  layerIds: string[];
  role: string;
}) {
  const count = await prisma.role.count({
    where: {
      layerId: {
        in: layerIds,
      },
      userId,
      role,
    },
  });

  return count >= layerIds.length;
}

export async function hasRolesWithAccess(input: ServerHasRoleWithAccess) {
  Sentry.addBreadcrumb({ message: "hasRolesWithAccess", data: input });

  const count = await boostedPrisma.role.count({
    where: {
      layerId: {
        in: input.layerIds,
      },
      userId: input.userId,
      role: {
        in: input.rolesWithAccess,
      },
    },
  });

  if (input.needsAllRoles) {
    const uniqueLayerIds = input.layerIds.filter(
      (value, index, self) => self.indexOf(value) === index,
    );
    return count >= uniqueLayerIds.length;
  }

  return count > 0;
}

export async function hasRolesInAtLeastOneLayer(
  data: ServerHasRolesInAtLeastOneLayer,
) {
  const count = await prisma.role.count({
    where: {
      layerId: { in: data.layerIds },
      userId: data.userId,
      role: {
        in: data.rolesWithAccess,
      },
    },
  });

  return count > 0;
}

export const hasRolesInInstitution = async (
  userId: string,
  institutionId: string,
  roles: Role[],
) => {
  const userRoles = await prisma.role.findMany({
    where: {
      userId,
      institutionId,
    },
  });

  return (
    userRoles.filter((role) => roles.includes(role.role as any)).length > 0
  );
};

export async function createOrUpdateRole({
  userId,
  layerId,
  institutionId,
  role,
  setActive,
}: {
  userId: string;
  layerId: string;
  institutionId: string;
  role: Role;
  setActive?: boolean;
}) {
  const active =
    setActive ?? (await isUserActiveInInstitution(userId, institutionId));
  if (await roleExists({ userId, layerId, institutionId }))
    return await updateRole({ userId, layerId, institutionId, role, active });
  return await createRole({ userId, layerId, institutionId, role, active });
}

export async function createRole(data: ServerCreateRole) {
  const layer = await getSimpleLayer(data.layerId);
  if (layer?.isCourse) {
    if (layer.isLinkedCourse && layer.linkedCourseLayerId) {
      // create the role to the actual course and add user to course chat
      await Promise.all([
        createSimpleRole({
          ...data,
          layerId: layer.linkedCourseLayerId,
        }),
        createUserMembershipToChannel(
          layer.linkedCourseLayerId,
          data.userId,
          "course",
        ),
      ]);
    } else {
      await createUserMembershipToChannel(data.layerId, data.userId, "course");
    }
    return await createSimpleRole(data);
  }

  return await createStackedRole(data);
}

export async function createSimpleRole(data: ServerCreateRole) {
  const operation = await prisma.role.create({
    data: {
      userId: data.userId,
      layerId: data.layerId,
      institutionId: data.institutionId,
      role: data.role,
      active: data.active,
    },
  });

  await cacheHandler.invalidate.single(
    "user-courses-with-progress-data",
    data.userId,
  );
  return operation;
}

export async function createStackedRole(args: ServerCreateRole) {
  const { institutionId, active, layerId, role, userId } = args;
  sentry.addBreadcrumb({ message: "Creating Stacked Role" }, args);

  let ids = await getChildrenIdsOfLayer(layerId);
  ids.push(layerId);

  /**
   * if there are linkedCourses, also create the associated role to its ActualCourse
   * the role of the actualCourse will be the same role in this function's argument
   *
   * e.g. creating a role of "MODERATOR" to linkedCourse will also create a
   * "MODERATOR" role to the actualCourse
   */

  const courseToLinkMapping = await getLayerIdToLinkedCourseLayerIdMapping(ids);
  if (!!Object.keys(courseToLinkMapping).length) {
    const actualCourseLayerIds = Object.values(courseToLinkMapping);
    actualCourseLayerIds.forEach((id) => {
      ids.push(id);
    });
  }

  ids = [...new Set([...ids])]; // remove duplicates

  const result = await prisma.role.createMany({
    data: ids.map((id) => ({
      layerId: id,
      userId,
      institutionId,
      role,
      active,
    })),
  });

  await cacheHandler.invalidate.single(
    "user-courses-with-progress-data",
    userId,
  );
  await createUserMembershipToChannel(ids, userId, "course");
  return result;
}

export async function updateRole(data: ServerCreateRole) {
  const layer = await getSimpleLayer(data.layerId);

  if (layer?.isCourse) {
    const promises: ReturnType<typeof updateSimpleRole>[] = [];
    // if its a linkedCourse role we are updating, also update the role of its actualCourse
    if (layer.isLinkedCourse && layer.linkedCourseLayerId) {
      promises.push(
        updateSimpleRole({
          ...data,
          layerId: layer.linkedCourseLayerId,
        }),
      );
    } else {
      /**
       * check if the course has any associated linkedCourses,
       * if true include update of all associated linkedCourse roles
       */
      const linkedLayers = await getLinkedLayersOfCourse([layer.id], {
        id: true,
      });
      linkedLayers.forEach((layer) => {
        promises.push(updateSimpleRole({ ...data, layerId: layer.id }));
      });
    }
    promises.push(updateSimpleRole({ ...data, layerId: layer.id }));
    return await Promise.all(promises);
  }

  return await updateStackedRole(data);
}

export async function updateSimpleRole(data: ServerCreateRole) {
  const opertion = await prisma.role.updateMany({
    where: {
      userId: data.userId,
      layerId: data.layerId,
      institutionId: data.institutionId,
    },
    data: {
      role: data.role,
      active: data.active,
    },
  });

  await cacheHandler.invalidate.single(
    "user-courses-with-progress-data",
    data.userId,
  );
  return opertion;
}

export async function updateStackedRole(data: ServerCreateRole) {
  let ids = await getChildrenIdsOfLayer(data.layerId);

  /**
   * if there are linkedCourses, also update the associated role to its ActualCourse
   * the new role of the actualCourse will be the role in this function's argument
   *
   * e.g. updating a role of "MODERATOR" to linkedCourse will also make a
   * his role a "MODERATOR" in the actual course
   */

  const courseToLinkMapping = await getLayerIdToLinkedCourseLayerIdMapping(ids);
  if (!!Object.keys(courseToLinkMapping).length) {
    const actualCourseLayerIds = Object.values(courseToLinkMapping);
    actualCourseLayerIds.forEach((id) => {
      ids.push(id);
    });
  }

  /**
   * Check if any of the courses have associated linkedLayers,
   * if true also update the role to the linkedLayer
   *
   * e.g. updating a user's role of a course to "MODERATOR" will
   * also update all linkedCourses' roles to "MODERATOR"
   */
  const linkedLayers = await getLinkedLayersOfCourse(ids, {
    id: true,
  });

  linkedLayers.forEach((layer) => {
    ids.push(layer.id);
  });

  ids = [...new Set([...ids])]; // remove duplicates

  const operation = await prisma.role.updateMany({
    where: {
      userId: data.userId,
      layerId: {
        in: ids,
      },
      institutionId: data.institutionId,
    },
    data: {
      role: data.role,
      active: data.active,
    },
  });

  await cacheHandler.invalidate.single(
    "user-courses-with-progress-data",
    data.userId,
  );
  return operation;
}

export async function deleteRole(
  userId: string,
  layerId: string,
  institutionId: string,
) {
  const layer = await getSimpleLayer(layerId);
  const layerIds = [layerId];

  if (layer?.isCourse) {
    if (layer.isLinkedCourse && layer.linkedCourseLayerId) {
      // if it is a linkedCourse also delete the associated role to the ActualCourse
      layerIds.push(layer.linkedCourseLayerId);
    } else {
      // if a course, check if there are any connected linkedCourseLayerIds roles and also delete them
      const linkedLayers = await prisma.layer.findMany({
        where: { linkedCourseLayerId: layerId },
        select: { id: true },
      });

      linkedLayers.forEach((l) => layerIds.push(l.id));
    }

    await removeUsersFromChannel(
      userId,
      layer.linkedCourseLayerId ?? layerId,
      "course",
    ).catch(console.log);
  }

  return await prisma.role.deleteMany({
    where: {
      layerId: { in: layerIds },
      userId,
      institutionId,
    },
  });
}

export async function deleteStackedRole(
  userId: string,
  layerId: string,
  institutionId: string,
) {
  let ids = await getChildrenIdsOfLayer(layerId);
  ids.push(layerId);

  const courseToLinkMapping = await getLayerIdToLinkedCourseLayerIdMapping(ids);
  ids = ids.concat(Object.entries(courseToLinkMapping).flat());
  ids = [...new Set([...ids])]; // remove duplicates if any

  return await prisma.$transaction(async (tx) => {
    const result = await tx.role.deleteMany({
      where: {
        userId,
        layerId: {
          in: ids,
        },
        institutionId,
      },
    });

    await removeUserMembershipFromChannel(ids, userId, "course");
    return result;
  });
}

export async function countAllAdminsOfInstitution(institutionId: string) {
  return await prisma.role.count({
    where: {
      institutionId,
      role: "admin",
    },
  });
}

export async function deleteAllRolesForInstitution(
  userId: string,
  institutionId: string,
) {
  return await prisma.role.deleteMany({
    where: {
      userId,
      institutionId,
    },
  });
}

export async function getTotalActiveUsersOfInstitution(
  institutionId: string,
  countAccessPassUsers: boolean,
) {
  let totalRoles = await prisma.role.count({
    where: {
      layerId: `${institutionId}`,
      institutionId: `${institutionId}`,
      active: true,
      role: {
        notIn: ["educator", "moderator", "admin"],
      },
    },
  });

  if (!countAccessPassUsers) {
    const totalAccessPassUsers = await getAmountOfUsersJoinedFromAccessPass({
      institutionId,
      status: "active",
    });
    totalRoles = totalRoles - totalAccessPassUsers;
  }
  return totalRoles;
}

export async function deleteAllRolesFromUsersForInstitution(
  userIds: string[],
  institutionId: string,
) {
  return await prisma.role.deleteMany({
    where: {
      userId: {
        in: userIds,
      },
      institutionId,
    },
  });
}

export async function setStatusOfUsers(
  userIds: string[],
  institutionId: string,
  active: boolean,
) {
  return await prisma.role.updateMany({
    where: {
      userId: {
        in: userIds,
      },
      institutionId,
    },
    data: {
      active,
    },
  });
}

export async function reassureInstitutionAccess(
  userId: string,
  institutionId: string,
): Promise<InviteResponse | undefined> {
  try {
    const count = await prisma.role.count({
      where: {
        userId,
        layerId: institutionId,
        role: "member",
        institutionId,
      },
    });
    const isMember = count > 0;

    if (!isMember) {
      await prisma.role.create({
        data: {
          userId,
          institutionId,
          layerId: institutionId,
          role: "member",
        },
      });

      const institution = await getSimpleLayer(institutionId);

      if (!institution) return;

      //TODO: Send notification
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    throw new Error("could-not-reassure-institution-access");
  }
}

export async function getRoles(userId: string, institutionId: string) {
  const roles = await prisma.role.findMany({
    where: {
      userId,
      institutionId,
    },
  });

  return roles;
}

export async function getAllRolesFromUser(userId: string) {
  const roles = await prisma.role.findMany({
    where: {
      userId,
    },
  });

  return roles;
}

export async function roleExists({
  userId,
  layerId,
  institutionId,
}: {
  userId: string;
  layerId: string;
  institutionId: string;
}) {
  if (layerId === institutionId) return false;
  const roles = await prisma.role.count({
    where: {
      userId,
      institutionId,
      layerId,
    },
  });

  return roles > 0;
}

export async function hasHigherRoles({
  userId,
  layerId,
  institutionId,
  role,
}: {
  userId: string;
  layerId: string;
  institutionId: string;
  role: string;
}) {
  const roles = await getRoles(userId, institutionId);
  const hasAdminRolesForLayer = roles.some(
    (role) => role.role === "admin" && role.layerId === layerId,
  );
  const hasModeratorRolesForLayer = roles.some(
    (role) => role.role === "moderator" && role.layerId === layerId,
  );
  const hasEducatorRolesForLayer = roles.some(
    (role) => role.role === "educator" && role.layerId === layerId,
  );
  if (role === "admin") return false;
  if (role === "moderator") return hasAdminRolesForLayer;
  if (role === "educator")
    return hasAdminRolesForLayer || hasModeratorRolesForLayer;
  if (role === "member")
    return (
      hasAdminRolesForLayer ||
      hasModeratorRolesForLayer ||
      hasEducatorRolesForLayer
    );
  return false;
}

export async function getHighestRoleOfUser(
  userId: string,
  institutionId: string,
): Promise<Role | null> {
  sentry.addBreadcrumb({
    message: "Getting highest role of user",
    data: { userId },
  });
  const roles = await boostedPrisma.role.findMany({
    where: {
      userId,
      institutionId,
    },
    select: {
      role: true,
    },
  });

  sentry.addBreadcrumb({ message: "Got roles", data: { roles } });
  if (roles.some((role) => role.role === "admin")) return "admin";
  if (roles.some((role) => role.role === "moderator")) return "moderator";
  if (roles.some((role) => role.role === "educator")) return "educator";
  if (roles.some((role) => role.role === "member")) return "member";
  return null;
}

export async function getUserIdsWithAccess(layerId: string) {
  const roles = await prisma.role.findMany({
    where: {
      layerId,
    },
    select: {
      userId: true,
    },
  });

  const uniqueRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.userId === role.userId),
  );

  return uniqueRoles.map((role) => role.userId);
}

export async function isUserActiveInInstitution(
  userId: string,
  institutionId: string,
) {
  sentry.addBreadcrumb({
    message: "Checking if user is active in institution",
    data: { userId, institutionId },
  });
  const roles = await boostedPrisma.role.findMany({
    where: {
      userId,
      institutionId,
    },
  });
  sentry.addBreadcrumb({ message: "Check completed", data: { roles } });

  return roles.every((role) => role.active);
}

export async function getUsersWithAccess(
  data: ServerGetUsersWithAccess,
): Promise<UserWithAccess[]> {
  const layer = await getSimpleLayer(data.layerId);
  if (!layer) return [];

  const roles = await prisma.role.findMany({
    where: {
      layerId: data.layerId,
      ...(data.roleFilter
        ? {
            role: {
              in: data.roleFilter,
            },
          }
        : {}),
      ...(data.search
        ? {
            user: {
              name: {
                contains: data.search,
              },
            },
          }
        : {}),
    },
    ...(data.take ? { take: data.take } : {}),
    select: {
      user: { select: { id: true, name: true, image: true, email: true } },
      role: true,
      active: true,
    },
  });

  return mapInvitesToRoles(
    roles,
    Array.from(new Set([data.layerId, layer.institution_id])),
  );
}

export async function mapInvitesToRoles(
  roles: GetUsersWithAccess[],
  layerIds: string[],
  institutionId?: string,
): Promise<UserWithAccess[]> {
  const uids = roles.map((r) => r.user.id);
  /**
   * this is refactored this way so as to avoid a PrismaPanicError which happens
   * when including invites inside prisma.role.findMany.select.user.select.invite
   */
  const invites = await prisma.invite.findMany({
    where: { target: { in: layerIds }, user: { id: { in: uids } } },
  });

  const EmailToInvitesMapping = invites.reduce<Record<string, Invite[]>>(
    (acc, invite) => {
      if (!invite.email) return acc;
      return {
        ...acc,
        [invite.email]:
          invite.email in acc ? [...acc[invite.email]!, invite] : [invite],
      };
    },
    {},
  );

  const uniqueRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.user.id === role.user.id),
  );

  let userIdToJoinedCoursesCountMapping: UserIdToJoinedCoursesCountMapping;
  if (institutionId) {
    userIdToJoinedCoursesCountMapping = await _getUserIdToCoursesCountMapping(
      uids,
      institutionId,
    );
  }

  return uniqueRoles.map<UserWithAccess>(({ role, user, active }) => {
    const userWithInvite = {
      ...user,
      invites: EmailToInvitesMapping[user.email] || [],
    };

    return {
      ...user,
      ...(institutionId && userIdToJoinedCoursesCountMapping
        ? {
            coursesJoinedCount: userIdToJoinedCoursesCountMapping[user.id],
          }
        : {}),
      invite: userWithInvite.invites[0] || null,
      role: role as Role,
      accessState: active ? "active" : "inactive",
      accessLevel: "access",
    };
  });
}

export async function getUsersForAddingToLayer(
  data: ServerGetForAddingToLayer,
): Promise<UserWithActiveStatus[]> {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: data.search || "",
          },
        },
        { email: { contains: data.search || "" } },
      ],
      roles: {
        some: {
          institutionId: data.institutionId,
        },
        every: {
          OR: [
            {
              // we want to add users who are currently NOT inside the layer
              NOT: {
                layerId: data.layerId,
              },
            },
            {
              AND: {
                layerId: data.institutionId,
                role: {
                  in: ["member"],
                },
              },
            },
          ],
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      roles: {
        where: {
          institutionId: data.institutionId,
        },
      },
    },
    take: 3,
  });

  return users.map((user) => {
    return {
      ...user,
      active: user.roles.every((role) => role.active),
    };
  });
}

export async function getUserIdsWithRoles(layerId: string, role: Role[]) {
  const roles = await prisma.role.findMany({
    where: {
      layerId,
      role: {
        in: role,
      },
    },
    select: {
      userId: true,
    },
  });

  const uniqueRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.userId === role.userId),
  );

  return uniqueRoles.map((role) => role.userId);
}

export async function getUserIdsWithRolesInMultipleLayers(
  layerIds: string[],
  role: Role[],
) {
  const roles = await prisma.role.findMany({
    where: {
      layerId: {
        in: layerIds,
      },
      role: {
        in: role,
      },
    },
    select: {
      userId: true,
    },
  });

  const uniqueRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.userId === role.userId),
  );

  return uniqueRoles.map((role) => role.userId);
}

export async function checkUserIsAdminOrHasAccessToLayer({
  layerId,
  userId,
  institutionId,
}: {
  layerId: string;
  userId: string;
  institutionId: string;
}) {
  const promise1 = hasRolesWithAccess({
    layerIds: [institutionId],
    userId,
    rolesWithAccess: ["admin"],
  });
  const promise2 = hasRolesWithAccess({
    layerIds: [layerId],
    userId,
    rolesWithAccess: ["educator", "member", "moderator"],
  });
  const [result1, result2] = await Promise.all([promise1, promise2]);
  return result1 || result2;
}

/**
 * Currently all roles are inherited by every child layer,
 *
 * example layers A > B > C > D:
 * - Every user in layer A is automatically a member of layer D.
 * - However, not all members of layers C or D are also members of layers A and B.
 *
 * To get the direct users of layers C and D,
 * use `Roles.parentId` to find the difference between the users of C and D from those of A and B.
 * TODO: test cases
 */

export async function getSortedUserRolesOfLayer({
  layerId,
  parentId,
  institutionId,
  excludeAdmins = true, // admins are automatically a member of every layer
}: GetSortedUserRolesOfLayerArgs) {
  const ids = Array.isArray(layerId)
    ? layerId
    : await getChildrenIdsOfLayer(layerId);

  /**
   * since all users have member roles in an institution,
   * if parentId is the institutionId just get roles of the layerId
   * */
  const parentLayer = parentId === institutionId ? [] : [parentId];

  const roles = await prisma.role.findMany({
    where: { layerId: { in: ids.concat(parentLayer) }, institutionId },
  });

  /**
   * categorize the userIds into 2 groups
   * - those who have roles inherited from parentLayers
   * - those who have direct-access roles
   */
  const sortedRoles = roles.reduce(
    (p, c) => {
      if (c.layerId === parentId) {
        p.inheritedRoles.push(c.userId);
      } else {
        p.directRoles.push(c.userId);
      }

      return p;
    },
    { inheritedRoles: [], directRoles: [] } as {
      inheritedRoles: string[];
      directRoles: string[];
    },
  );

  /**
   * Since some userIds above can belong to both inheritedRole and directRole groups,
   * we filter out those userIds who only belong to the directRoles group
   * (those that dont belong to the inheritedRoles group)
   */
  let directAccessRoles = sortedRoles.directRoles.filter(
    (uid) => !sortedRoles.inheritedRoles.includes(uid),
  );

  /**
   * option to exclude admins from the return as admins are already a member of every child layer
   * default to true
   */
  if (excludeAdmins) {
    const admins = await getAdminsOfInstitution(institutionId);
    const adminIds = admins.map((i) => i.id);
    directAccessRoles = directAccessRoles.filter(
      (id) => !adminIds.includes(id),
    );
  }

  directAccessRoles = [...new Set([...directAccessRoles])]; // remove duplicates

  let parentAccessRoles = sortedRoles.inheritedRoles.filter(
    (uid) => !directAccessRoles.includes(uid),
  );

  parentAccessRoles = [...new Set([...parentAccessRoles])];
  return { directAccessRoles, parentAccessRoles };
}

export async function getUsersAndDataFieldsOfInstitution(
  institutionId: string,
  args: Partial<InstitutionUserManagementFilter>,
): Promise<InstitutionUserManagement> {
  const { showStatus, search } = args;
  const take = parseInt(args.take?.toString() ?? "10") || 10;
  const skip = parseInt(args.skip?.toString() ?? "0") || 0;
  const layerIds = args.layerIds?.split(",") ?? [];
  const groupIds = args.groupIds?.split(",") ?? [];

  // build the where query so it can be shared between findMany and count
  const where = buildQuery<Prisma.RoleWhereInput>({
    layerId: layerIds.length ? { in: layerIds } : undefined,
    institutionId,
    active:
      showStatus && showStatus !== "all" ? showStatus === "active" : undefined,
    user:
      groupIds.length || search
        ? buildQuery<Prisma.RoleWhereInput["user"]>({
            InstitutionUserGroupMembership: groupIds.length
              ? { some: { groupId: { in: groupIds } } }
              : undefined,
            OR: search
              ? [
                  { name: { contains: search } },
                  { email: { contains: search } },
                ]
              : undefined,
          })
        : undefined,
  });

  const users = await prisma.role.findMany({
    where,
    orderBy: {
      user: {
        name: "asc",
      },
    },
    skip: skip ? +skip : undefined,
    take: take ? +take : undefined,
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      role: true,
      active: true,
    },
    distinct: "userId",
  });

  // just get minimal findMany data here are as currently cannot count distinct https://github.com/prisma/prisma/issues/4228
  const roleIds = await prisma.role.findMany({
    where,
    select: { id: true },
    distinct: "userId",
  });

  // compute the totalPages
  const divisor = take && users.length < +take ? +take : users.length;
  const total = Math.ceil(roleIds.length / divisor);

  // map invites to roles, get dataFields and values of the userDataFields
  const [usersWithAccess, dataFields, userFields] = await Promise.all([
    mapInvitesToRoles(users, [institutionId], institutionId),
    getInstitutionUserDataFields(institutionId, false),
    getInstitutionUserDataFieldValuesOfInstitution({
      institutionId,
      userIds: users.map(({ user }) => user.id),
    }),
  ]);

  return {
    users: usersWithAccess.map((user) => ({
      ...user,
      fieldData: userFields.filter((field) => field.userId === user.id),
    })),
    dataFields,
    total,
  };
}

/** Returns a mapping of userId to number of joined courses */
async function _getUserIdToCoursesCountMapping(
  id: string | string[],
  institutionId: string,
) {
  const ids = Array.isArray(id) ? id : [id];
  const usersWithCourseCount = await prisma.role.findMany({
    where: { institutionId, userId: { in: ids } },
    select: { userId: true, layer: { select: { isCourse: true } } },
  });

  return usersWithCourseCount.reduce<UserIdToJoinedCoursesCountMapping>(
    (prev, curr) => {
      const existingCount = prev[curr.userId];
      return {
        ...prev,
        [curr.userId]:
          typeof existingCount !== "undefined"
            ? existingCount + Number(curr.layer.isCourse)
            : Number(curr.layer.isCourse),
      };
    },
    {},
  );
}

type GetSortedUserRolesOfLayerArgs = {
  layerId: string | string[];
  parentId: string;
  institutionId: string;
  excludeAdmins?: boolean; // admins are automatically a member of every layer
};

export type GetUsersWithAccess = Prisma.RoleGetPayload<{
  select: {
    user: { select: { id: true; name: true; image: true; email: true } };
    role: true;
    active: true;
  };
}>;

type UserIdToJoinedCoursesCountMapping = Record<string, number>;
