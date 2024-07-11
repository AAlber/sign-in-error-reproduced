import type { AccessPass, InstitutionStripeAccount } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import cuid from "cuid";
import type Stripe from "stripe";
import { SettingId } from "@/src/components/institution-settings/tabs";
import type {
  AccessPassStatusInfo,
  CreateAccessPassSubscriptionData,
  CreateCheckoutSessionData,
  EnhancedAccessPass,
} from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import { getLayer } from "../server-administration";
import { getInstitutionById } from "../server-institutions";
import { createCheckoutSession } from "../server-paid-add-ons";
import {
  addCustomerMetadata,
  getUpcomingInvoice,
  retrieveSubscription,
  sendUsageReport,
} from "../server-stripe";
import {
  createAccessPassUsageLog,
  getAccessPassUsageLogsWithUserId,
  getAmountOfUsersJoinedFromAccessPass,
} from "./db-requests";

export const createAccessPassSubscription = async (
  stripeAcc: InstitutionStripeAccount,
  data?: CreateAccessPassSubscriptionData,
) => {
  const institution = await getInstitutionById(data?.institutionId as string);
  if (institution && data) {
    await addCustomerMetadata({
      institutionId: institution.id,
      institutionName: institution.name,
      customerId: stripeAcc?.customerId as string,
    });
    const { userId, ...checkoutSessionData } = data;
    const sessionDataCopy: CreateCheckoutSessionData = {
      ...checkoutSessionData,
      success_url:
        `${process.env.NEXT_PUBLIC_SERVER_URL}` +
        `?page=ORGANIZATION_SETTINGS&tab=${SettingId.AccessPasses}`,
      metadata: {
        accessPassId: data.accessPassId,
      },
      ...(stripeAcc.accessPassCouponId
        ? { accessPassCouponId: stripeAcc.accessPassCouponId }
        : {}),
    };
    const sessionUrl = createCheckoutSession(stripeAcc, sessionDataCopy);
    return sessionUrl;
  }
};

export const getAccessPassStatusInfos = async (data: {
  institutionId: string;
}): Promise<AccessPassStatusInfo[]> => {
  const res: EnhancedAccessPass[] = await getAllAccessPasses(data);
  const accessPassStatusInfos = await Promise.all(
    res.map(async (accessPass: EnhancedAccessPass) => {
      const layer = await getLayer(accessPass.layerId);
      if (accessPass.subscriptionId) {
        return await getAccessPassSubscriptionStatusInfo(
          accessPass,
          layer ? layer.name : "Deleted Layer",
          data,
        );
      } else {
        return {
          status: null,
          active: false,
          currentMaxUsage: 0,
          accessPass,
          link: null,
          layerName: layer!.name,
        };
      }
    }),
  );
  const validAccessPassStatusInfos = accessPassStatusInfos.filter(
    (info) => info !== undefined,
  );
  return validAccessPassStatusInfos;
};

export const getAllAccessPasses = async (data: {
  institutionId: string;
}): Promise<AccessPass[]> => {
  return await prisma.accessPass.findMany({
    where: {
      institutionId: data.institutionId,
    },
    include: {
      invite: true,
      accessPassPaymentInfo: true,
    },
  });
};

export const createUsageLogs = async (
  userId: string,
  accessPass?: AccessPass | null,
) => {
  const accessPassUsageLogsWithUserId =
    accessPass && (await getAccessPassUsageLogsWithUserId(accessPass, userId));
  try {
    if (accessPass && accessPassUsageLogsWithUserId?.length === 0) {
      const idempotencyKey = cuid();

      const log = await createAccessPassUsageLog(
        accessPass,
        userId,
        idempotencyKey,
      );
      if (log) {
        const subscription = await retrieveSubscription(
          accessPass.subscriptionId as string,
        );
        const subscriptionItem = subscription.items.data[0]?.id as string;
        try {
          const usageReport = await sendUsageReport(
            subscriptionItem,
            1,
            idempotencyKey,
          );
          return usageReport;
        } catch (e) {
          throw new Error(
            `${idempotencyKey} failed because ${(e as Error).message}`,
          );
        }
      } else {
        throw new Error("Could not create usage log");
      }
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    throw new Error("could-not-create-usage-logs");
  }
};

export const getUpcomingAccessPassInvoices = async (
  accessPasses: AccessPass[],
  customerId: string,
) => {
  try {
    const promises: Promise<any>[] = [];
    for (const accessPass of accessPasses) {
      if (accessPass.subscriptionId) {
        promises.push(
          getUpcomingInvoice(accessPass.subscriptionId, customerId),
        );
      }
    }
    const result = await Promise.allSettled(promises);
    const fulfilledValues = result
      .filter(
        (promiseResult) =>
          promiseResult.status === "fulfilled" &&
          promiseResult.value !== undefined,
      )
      .map((promiseResult) => (promiseResult as any).value);
    return fulfilledValues;
  } catch (e) {
    // console.error((e as Error).name)
  }
};

export const addCancelAtPeriodEndIfNeeded = async (
  subscription: Stripe.Subscription,
) => {
  if (!subscription.cancel_at && !subscription.cancel_at_period_end) {
    return await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
  }
};

export const getAccessPassSubscriptionStatusInfo = async (
  accessPass: EnhancedAccessPass,
  layerName: string,
  data: { institutionId: string },
): Promise<AccessPassStatusInfo> => {
  const status = accessPass.status;
  const active = status === "active";

  const { invite } = accessPass;
  const currentMaxUsage = await getAmountOfUsersJoinedFromAccessPass({
    institutionId: data.institutionId,
    accessPassId: accessPass.id,
  });

  return {
    status,
    active,
    currentMaxUsage,
    accessPass,
    layerName,
    link: `${process.env.SERVER_URL}/invitation/${invite?.target}/${invite?.token}`,
  };
};
