import type {
  AccessPass,
  InstitutionStripeAccount,
  Invite,
  StripeSubscriptionStatus,
} from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import cuid from "cuid";
import type Stripe from "stripe";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import type {
  AccessPassIdData,
  CreateAccessPassData,
  ProductAndPriceId,
  UpdateAccessPassData,
} from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import { createInvite } from "../server-invite";
import {
  createProductAndPrice,
  updateProductAndPrice,
} from "../server-paid-access-passes";
import { addAccessPassPaymentInfo } from "../server-paid-access-passes/db-requests";
import {
  deleteStackedRole,
  getTotalActiveUsersOfInstitution,
  setStatusOfUsers,
} from "../server-role";
import { getOrCreateStripeAccountForInstitution } from "../server-stripe";
import { getInstitutionStripeAccount } from "../server-stripe/db-requests";
import { getCurrentInstitution } from "../server-user";
import { getSettledPromises } from "../server-utils";
import { extractPaymentInfoUpdate, getMaxUsers } from "./data-extrapolation";
import { addCancelAtPeriodEndIfNeeded } from "./index";
import {
  getAmountOfUniqueUserIds,
  getUniqueUserIdsWithAccessPasses,
} from "./utils";

export const getAccessPassesOfInstitution = async (institutionId: string) => {
  const institutionStripeAccount =
    await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institutionId,
      },
      include: {
        accessPasses: true,
      },
    });
  return institutionStripeAccount?.accessPasses;
};

export const createAccessPass = async (data?: CreateAccessPassData) => {
  const institution = await getCurrentInstitution(data?.userId as string);
  const token = Math.floor(Math.random() * 1000000000).toString();
  const stripeAcc = await getOrCreateStripeAccountForInstitution({
    institutionId: institution?.id as string,
    institutionName: institution?.name as string,
    userId: data?.userId as string,
  });

  const institutionStripeAccount = await addAccessPassToStripeAccount(
    stripeAcc as InstitutionStripeAccount,
    data,
  );
  const accessPassId =
    institutionStripeAccount.accessPasses[
      institutionStripeAccount.accessPasses.length - 1
    ]?.id;
  return await createInvite({
    layerId: data?.layerId as string,
    token,
    institutionId: institution?.id as string,
    role: "member",
    accessPassId,
  });
};

export const addAccessPassToStripeAccount = async (
  stripeAccount: InstitutionStripeAccount,
  data?: CreateAccessPassData,
) => {
  const { maxUsers, priceId, productInfo, isPaid, layerId } =
    data as CreateAccessPassData;
  const accessPassId = cuid();
  const res = await prisma.institutionStripeAccount.update({
    where: {
      id: stripeAccount.id,
    },
    data: {
      accessPasses: {
        create: {
          id: accessPassId,
          ...(maxUsers && { maxUsers }),
          layerId,
          stripePriceId: priceId,
          institutionId: stripeAccount.institutionId,
          isPaid,
        },
      },
    },
    include: {
      accessPasses: true,
    },
  });
  if (isPaid && productInfo && res.connectAccountId) {
    await addAccessPassPaymentInfo({
      accessPassId,
      info: productInfo,
      connectedAccountId: res.connectAccountId,
    });
  }
  return res;
};

export const deleteAccessPass = async (data?: AccessPassIdData) => {
  return await prisma.accessPass.delete({
    where: {
      id: data?.accessPassId,
    },
  });
};

export const updateAccessPassAndAddCancellation = async (
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
) => {
  const metaAccessPassId = subscription.metadata.accessPassId as string;
  if (!subscription.items.data[0]?.price.id) throw new Error("No price id");
  const maxUsers = getMaxUsers(subscription);
  await addCancelAtPeriodEndIfNeeded(subscription);
  await prisma.accessPass.update({
    where: {
      id: metaAccessPassId,
    },
    data: {
      ...(maxUsers && { maxUsers }),
      status: subscription.status,
      stripePriceId: subscription.items.data[0]?.price.id,
      subscriptionId: subscription.id,
      endDate: subscription.current_period_end,
    },
  });
};

export const updateStripeProduct = async (
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateAccessPassData,
): Promise<ProductAndPriceId> => {
  if (!stripeAccount.connectAccountId)
    throw new Error("No connected account found.");
  if (data?.accessPass.accessPassPaymentInfo) {
    return await updateProductAndPrice({
      data,
      connectedAccountId: stripeAccount.connectAccountId,
    });
  } else {
    if (!data?.productAndPriceInfo)
      throw new Error("No product and price info found");
    return await createProductAndPrice({
      info: data?.productAndPriceInfo,
      productName: data.productAndPriceInfo.name,
      connectedAccountId: stripeAccount.connectAccountId,
    });
  }
};

export const updateAccessPass = async (
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateAccessPassData,
) => {
  const infoUpdate = await extractPaymentInfoUpdate(stripeAccount, data);
  const res: ProductAndPriceId | null = data?.isPaid
    ? await updateStripeProduct(stripeAccount, data)
    : null;
  return await prisma.accessPass.update({
    where: { id: data?.accessPass.id },
    data: {
      maxUsers: data?.maxUsers,
      isPaid: data?.isPaid,
      ...(data?.isPaid &&
        res && {
          accessPassPaymentInfo: {
            upsert: {
              create: {
                ...infoUpdate,
                stripePriceId: res.priceId,
                productId: res.productId,
              },
              update: {
                ...infoUpdate,
                stripePriceId: res.priceId,
                productId: res.productId,
              },
            },
          },
        }),
    },
  });
};

export const cancelAccessPass = async (
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
) => {
  const accessPassId = subscription.metadata.accessPassId as string;
  if (stripeAccount) {
    const invite = await getInvite(accessPassId);
    const layerId = invite?.target;
    const usageLogs = await getAllUsageLogs(accessPassId);
    const userIdsWithThisAccessPass = usageLogs.map((log) => log.userId);
    deleteOldInvite(accessPassId);
    await deleteRelevantRoles(
      userIdsWithThisAccessPass,
      stripeAccount.institutionId,
      layerId as string,
    );
    archiveUsersThatOnlyHaveThisAccessPass(
      userIdsWithThisAccessPass,
      stripeAccount.institutionId,
    );
    updateAccessPassAndAddCancellation(subscription, stripeAccount);
  }
};

export const getAmountOfAccessPassUsageLogs = async (accessPassId: string) => {
  return await prisma.accessPassUsageLog.count({
    where: {
      accessPassId: accessPassId,
    },
  });
};

export const getInstitutionAccessPassesAndLogs = async ({
  institutionId,
  accessPassId,
  status,
}: {
  institutionId: string;
  accessPassId?: string;
  status?: StripeSubscriptionStatus;
}) => {
  return await prisma.accessPass.findMany({
    where: {
      institutionId: institutionId,
      ...(status && { status }),
      ...(accessPassId && { id: accessPassId }),
    },
    include: {
      usageLogs: true,
    },
  });
};

export const checkUserIdHasActiveAccessPass = async ({
  userId,
  institutionId,
}: {
  userId: string;
  institutionId: string;
}) => {
  const accessPasses = await getInstitutionAccessPassesAndLogs({
    institutionId,
    status: "active",
  });
  const uniqueUserIds = getUniqueUserIdsWithAccessPasses(accessPasses);
  return uniqueUserIds.has(userId);
};

export const getUserIdsWithAccessPasses = async ({
  userIds,
  institutionId,
}: {
  userIds: string[];
  institutionId: string;
}) => {
  // Initialize an array to hold promises
  const checkAccessPassPromises = userIds.map((userId) =>
    checkUserIdHasActiveAccessPass({ userId, institutionId }).then(
      (hasActivePass) => ({ userId, hasActivePass }),
    ),
  );

  // Resolve all promises simultaneously with Promise.all
  const results = await Promise.all(checkAccessPassPromises);

  // Separate the user IDs into those with and without active access passes
  const userIdsWithActiveAccessPasses = results
    .filter((result) => result.hasActivePass)
    .map((result) => result.userId);
  const userIdsWithOutActiveAccessPasses = results
    .filter((result) => !result.hasActivePass)
    .map((result) => result.userId);

  return {
    userIdsWithActiveAccessPasses,
    userIdsWithOutActiveAccessPasses,
  };
};

export const getUserIdsWithoutActiveAccessPasses = async ({
  userIds,
  institutionId,
}: {
  userIds: string[];
  institutionId: string;
}) => {
  const { userIdsWithOutActiveAccessPasses } = await getUserIdsWithAccessPasses(
    { userIds, institutionId },
  );
  return userIdsWithOutActiveAccessPasses;
};

export const checkUsersCanBecomeActive = async ({
  userIds,
  institutionId,
}: {
  userIds: string[];
  institutionId: string;
}) => {
  const [userIdsWithOutActiveAccessPasses, totalActiveNormalUsers, stripeAcc] =
    await Promise.all([
      getUserIdsWithoutActiveAccessPasses({ userIds, institutionId }),
      getTotalActiveUsersOfInstitution(institutionId, false),
      getInstitutionStripeAccount(institutionId),
    ]);
  const subscription = await stripe.subscriptions.retrieve(
    stripeAcc?.subscriptionId as string,
  );
  return (
    totalActiveNormalUsers + userIdsWithOutActiveAccessPasses.length <=
    (subscription.items.data[0]?.quantity as number)
  );
};

export const getAmountOfUsersJoinedFromAccessPass = async ({
  institutionId,
  accessPassId,
  status,
}: {
  institutionId: string;
  accessPassId?: string;
  status?: StripeSubscriptionStatus;
}): Promise<number> => {
  const accessPasses = await getInstitutionAccessPassesAndLogs({
    institutionId,
    accessPassId,
    status,
  });
  return getAmountOfUniqueUserIds(accessPasses);
};

export const getUsersJoinedFromAccessPass = async ({
  institutionId,
  status,
}: {
  institutionId: string;
  layerId?: string;
  status?: StripeSubscriptionStatus;
}): Promise<string[]> => {
  const accessPasses = await getInstitutionAccessPassesAndLogs({
    institutionId,
    accessPassId: undefined,
    status,
  });

  return Array.from(getUniqueUserIdsWithAccessPasses(accessPasses));
};

export const createAccessPassUsageLog = async (
  accessPass: AccessPass,
  userId: string,
  idempotencyKey: string,
) => {
  return await prisma.accessPassUsageLog.create({
    data: {
      accessPassId: accessPass.id,
      userId,
      idempotencyKey,
    },
  });
};

export const getAccessPassUsageLogs = async (accessPass: AccessPass) => {
  return await prisma.accessPassUsageLog.findMany({
    where: {
      accessPassId: accessPass.id,
    },
  });
};
export const getAccessPassUsageLogsWithUserId = async (
  accessPass: AccessPass,
  userId: string,
) => {
  const accessPassUsageLogs = await getAccessPassUsageLogs(accessPass);
  const accessPassUsageLogsWithUserId = accessPassUsageLogs.filter(
    (log) => log.userId === userId,
  );
  if (
    accessPass.maxUsers &&
    accessPassUsageLogs.length >= accessPass.maxUsers
  ) {
    throw new Error("Access Pass has reached max usage level");
  }
  return accessPassUsageLogsWithUserId;
};

export const deleteOldInvite = async (accessPassId: string) => {
  await prisma.invite.delete({
    where: {
      accessPassId: accessPassId,
    },
  });
};

export const getInvite = async (
  accessPassId: string,
): Promise<Invite | null> => {
  return await prisma.invite.findUnique({
    where: {
      accessPassId: accessPassId,
    },
  });
};

export const getAllUsageLogs = async (accessPassId: string) => {
  return await prisma.accessPassUsageLog.findMany({
    where: {
      accessPassId: accessPassId,
    },
  });
};

export const getUserIdsWithOtherRoles = async (
  userIds: string[],
  institutionId: string,
): Promise<string[]> => {
  const promises = userIds.map((userId) =>
    prisma.role
      .count({
        where: {
          institutionId,
          userId,
          layerId: {
            not: institutionId,
          },
        },
      })
      .then((total) => (total > 0 ? userId : null)),
  );

  const results = await Promise.all(promises);
  return results.filter((result) => result !== null) as string[];
};

export const deleteRelevantRoles = async (
  userIdsWithActiveAccessPasses: string[],
  institutionId: string,
  layerId: string,
): Promise<string[]> => {
  Sentry.captureMessage("Role deletion: Access pass or layer: " + layerId, {
    level: "log",
    extra: {
      institutionId,
      userIdsWithActiveAccessPasses,
      layerId: layerId,
    },
  });

  const promises: Promise<any>[] = [];
  for (const userId of userIdsWithActiveAccessPasses) {
    promises.push(deleteStackedRole(userId, layerId, institutionId));
  }
  return await getSettledPromises(promises);
};

export const archiveUsersThatOnlyHaveThisAccessPass = async (
  userIdsWithActiveAccessPasses: string[],
  institutionId,
) => {
  const userIdsWithOtherRoles = await getUserIdsWithOtherRoles(
    userIdsWithActiveAccessPasses,
    institutionId,
  );
  const userIdsWithOnlyThisAccessPass = userIdsWithActiveAccessPasses.filter(
    (id) => !userIdsWithOtherRoles.includes(id),
  );
  await setStatusOfUsers(userIdsWithOnlyThisAccessPass, institutionId, false);
  const userIdsToInvalidate = [
    ...userIdsWithOnlyThisAccessPass,
    ...userIdsWithOtherRoles,
  ];
  await cacheHandler.invalidate.many("user-data", userIdsToInvalidate);
  await cacheHandler.invalidate.many(
    "user-courses-with-progress-data",
    userIdsToInvalidate,
  );
};

export const createNewStripeAccountAndUpdateAccessPass = async (
  institutionId: string,
  subscription: Stripe.Subscription,
) => {
  if (!subscription.items.data[0]?.price.id) throw new Error("No price id");
  const stripeAccount = await prisma.institutionStripeAccount.create({
    data: {
      institutionId: institutionId,
      customerId: subscription.customer as string,
    },
  });
  await updateAccessPassAndAddCancellation(subscription, stripeAccount);
};

export const checkHasExceededMaxUsersOfAccessPass = async (
  accessPass?: AccessPass | null,
) => {
  if (!accessPass) return false;
  const accessPassUsageLogs = await getAccessPassUsageLogs(accessPass);
  if (
    accessPass.maxUsers &&
    accessPassUsageLogs.length >= accessPass.maxUsers
  ) {
    return true;
  }
  return false;
};
