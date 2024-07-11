import { prisma } from "../db/client";

export type CreateGroupArgs = {
  id: string;
  name: string;
  color: string;
  institutionId: string;
  additionalInformation: string;
};

export async function createUserGroup(args: CreateGroupArgs[]) {
  await prisma.institutionUserGroup.createMany({ data: args });
  return args;
}

export async function updateUserGroup(
  id: string,
  name: string,
  color: string,
  additionalInformation: string,
) {
  const group = prisma.institutionUserGroup.update({
    where: {
      id,
    },
    data: {
      name,
      color,
      additionalInformation,
    },
  });

  return group;
}

export async function deleteUserGroup(id: string) {
  const operation = prisma.institutionUserGroup.delete({
    where: {
      id,
    },
  });

  return operation;
}

export async function getGroupsOfUser(userId: string, institutionId: string) {
  const memberships = await prisma.institutionUserGroupMembership.findMany({
    where: {
      userId,
      institutionId,
    },
    include: {
      group: true,
    },
  });

  // group and since
  const groups = memberships.map((m) => {
    return {
      ...m.group,
      memberSince: m.since,
    };
  });
  return groups;
}

export async function deleteAllUserGroupMembershipsOfUsers(
  ids: string[],
  institutionId: string,
) {
  const operation = await prisma.institutionUserGroupMembership.deleteMany({
    where: {
      institutionId,
      userId: {
        in: ids,
      },
    },
  });
  return operation;
}

export async function getInstitutionUserGroup(id: string) {
  const group = prisma.institutionUserGroup.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
    },
  });

  return group;
}

export async function getInstitutionUserGroupsByIds(ids: string[]) {
  const group = prisma.institutionUserGroup.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      members: true,
    },
  });

  return group;
}

export async function getUserIdsOfUserGroup(id: string | string[]) {
  id = Array.isArray(id) ? id : [id];
  const memberships = await prisma.institutionUserGroupMembership.findMany({
    where: {
      groupId: {
        in: id,
      },
    },
    select: {
      userId: true,
    },
  });

  return memberships.map((m) => m.userId);
}

export async function removeUsersFromUserGroups(
  ids: string[],
  groupIds: string[],
) {
  const operation = prisma.institutionUserGroupMembership.deleteMany({
    where: {
      userId: {
        in: ids,
      },
      groupId: {
        in: groupIds,
      },
    },
  });

  return operation;
}

export async function getInstitutionIdOfUserGroup(id: string) {
  const group = await prisma.institutionUserGroup.findUnique({
    where: {
      id: id,
    },
    select: {
      institutionId: true,
    },
  });

  if (!group) return null;
  return group.institutionId;
}

export async function getInstitutionUserGroups(
  institutionId: string,
  search: string,
  includeMembers = true,
) {
  const groups = await prisma.institutionUserGroup.findMany({
    where: {
      institutionId,
      name: { contains: search },
    },
    include: {
      members: includeMembers,
    },
  });

  return groups.map((g) => {
    return {
      ...g,
      ...(includeMembers ? { members: g.members.length } : {}),
    };
  });
}

export async function getAllInstitutionUserGroups(institutionId: string) {
  const groups = await prisma.institutionUserGroup.findMany({
    where: {
      institutionId,
    },
  });

  return groups;
}

export async function getUserGroupsOfInstitutionForUser(
  userId: string,
  institutionId: string,
) {
  const memberships = await prisma.institutionUserGroupMembership.findMany({
    where: {
      userId,
      institutionId,
    },
    include: {
      group: true,
    },
  });

  return memberships.map((m) => m.group);
}

export async function addUsersToInstitutionUserGroup(
  userIds: string[],
  groupId: string,
  institutionId: string,
) {
  const data = userIds.map((userId) => {
    return {
      userId,
      groupId,
      institutionId,
    };
  });

  const existingMemberships =
    await prisma.institutionUserGroupMembership.findMany({
      where: {
        groupId,
        userId: {
          in: userIds,
        },
      },
    });

  const memberships = prisma.institutionUserGroupMembership.createMany({
    data: data.filter(
      (d) => !existingMemberships.find((m) => m.userId === d.userId),
    ),
  });

  return memberships;
}
