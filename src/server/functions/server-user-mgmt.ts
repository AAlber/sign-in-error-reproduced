import type { User } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import type {
  CreateInstitutionUser,
  InstitutionUserManagementUser,
} from "@/src/types/user-management.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { upsertUsers as upsertGetstreamUser } from "./server-chat/user-management";
import { deleteAllUserGroupMembershipsOfUsers } from "./server-institution-user-group";
import {
  createStackedRole,
  deleteAllRolesFromUsersForInstitution,
} from "./server-role";
import {
  checkSubscriptionHasSpaceFor1MoreUser,
  checkSubscriptionHasSpaceForMoreUsers,
} from "./server-stripe";
import { getCurrentInstitutionId } from "./server-user";
import { filterUniqueBy } from "./server-utils";

export default async function removeUsersFromInstitution(
  userIds: string[],
  institutionId: string,
) {
  Sentry.captureMessage("removing many users from institution", {
    extra: { userIds, institutionId },
    level: "log",
  });
  await deleteAllRolesFromUsersForInstitution(userIds, institutionId);
  await deleteAllUserGroupMembershipsOfUsers(userIds, institutionId);
  await removeCurrentInstitutionIfIdEquals(institutionId, userIds);
}

export async function removeCurrentInstitutionIfIdEquals(
  institutionId: string,
  userIds: string[],
) {
  const promises = userIds.map(async (userId) => {
    const currentInstitutionId = await getCurrentInstitutionId(userId);
    if (currentInstitutionId === institutionId) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentInstitution: null },
      });
    }
  });

  await Promise.all(promises);
}

export async function createInstitutionUser(
  data: CreateInstitutionUser,
  institutionId: string,
) {
  sentry.addBreadcrumb({ message: "creating institution user" }, data);
  let user: User | null = null;

  user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        currentInstitution: institutionId,
      },
    });
  }

  const roleCount = await prisma.role.count({
    where: {
      layerId: institutionId,
      institutionId: institutionId,
      userId: user!.id,
    },
  });

  const alreadyHasAccess = roleCount > 0;

  const hasSpaceFor1MoreUser = await checkSubscriptionHasSpaceFor1MoreUser({
    institutionId,
  });

  if (!alreadyHasAccess && data.giveAccessToLayer && !hasSpaceFor1MoreUser)
    throw new HttpError("Institution does not have space for 1 more user", 402);

  if (alreadyHasAccess)
    throw new HttpError("User already has access to this institution", 409);

  await Promise.all([
    prisma.role.create({
      data: {
        layerId: institutionId,
        institutionId: institutionId,
        userId: user!.id,
        role: data.role === "admin" ? "admin" : "member",
        active: data.giveAccessToLayer ? true : false,
      },
    }),
    upsertGetstreamUser(
      [{ id: user.id, email: user.email, name: user.name, image: user.image }],
      institutionId,
    ),
  ]);

  if (data.giveAccessToLayer) {
    await createStackedRole({
      userId: user!.id,
      layerId: data.giveAccessToLayer,
      institutionId: institutionId,
      role: data.role === "admin" ? "moderator" : data.role || "member",
      active: true,
    });
  }

  return {
    ...user,
    image: null,
    accessLevel: "access",
    accessState: "inactive",
    invite: null,
    role: "member",
    fieldData: [],
  } satisfies InstitutionUserManagementUser;
}

export async function createManyInstitutionUsers(
  institutionId: string,
  data: CreateInstitutionUser[],
) {
  log.info("Starting creation of many users");

  // filter out already existing users
  const emails = data.map(({ email }) => email);
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: emails }, currentInstitution: institutionId },
    select: { email: true },
  });

  const existingUserEmails = existingUsers.map(({ email }) => email);
  let usersToCreate = data.filter(
    ({ email }) => !existingUserEmails.includes(email),
  );

  // make sure only unique emails
  usersToCreate = filterUniqueBy(usersToCreate, "email");

  // check if institution stripe subscription has space for new users
  const isValid = await checkSubscriptionHasSpaceForMoreUsers(
    institutionId,
    usersToCreate.length,
  );

  if (!isValid) {
    throw new HttpError(
      `Your organization does not have space for ${usersToCreate.length} more users.`,
      409,
    );
  }

  await Promise.all(
    usersToCreate.map(({ email, name }) =>
      prisma.user.upsert({
        where: { email },
        create: { email, name, currentInstitution: institutionId },
        update: { currentInstitution: institutionId },
      }),
    ),
  );

  return await prisma.$transaction(
    async (tx) => {
      // if user exists, update currentInstitution, else create

      const newUsers = await tx.user.findMany({
        where: { email: { in: usersToCreate.map(({ email }) => email) } },
        select: { email: true, id: true, image: true, name: true },
      });

      await Promise.all([
        tx.role.createMany({
          data: newUsers
            .map((u) => {
              const userFromArgs = data.find((i) => i.email === u.email);
              if (!userFromArgs) return;
              return {
                institutionId,
                layerId: institutionId,
                userId: u.id,
                active: false,
                role: userFromArgs.role === "admin" ? "admin" : "member",
              };
            })
            .filter(filterUndefined),
        }),
        // create getStream users
        upsertGetstreamUser(
          newUsers.map((user) => user),
          institutionId,
        ),
      ]);

      await Promise.all(
        newUsers.map(async (user) => {
          const userFromArgs = data.find(({ email }) => email === user.email);
          if (!userFromArgs) return;
          if (!userFromArgs.giveAccessToLayer) return;
          await createStackedRole({
            active: true,
            institutionId,
            layerId: userFromArgs.giveAccessToLayer,
            userId: user.id,
            role:
              userFromArgs.role === "admin"
                ? "moderator"
                : userFromArgs.role || "member",
          });
        }),
      );

      return newUsers.map<InstitutionUserManagementUser>((user) => ({
        ...user,
        accessLevel: "access",
        accessState: "inactive",
        invite: null,
        role: "member",
        fieldData: [],
      }));
    },
    {
      timeout: 60000,
      maxWait: 60000,
    },
  );
}
