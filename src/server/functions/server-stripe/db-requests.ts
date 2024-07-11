import * as Sentry from "@sentry/nextjs";
import type Stripe from "stripe";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import type { IncludeType } from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import { getInstitutionById } from "../server-institutions";
import { getCurrentInstitution } from "../server-user";

export const linkStripeCustomerToInstitution = async ({
  institutionId,
  customerId,
  accessPassCouponId,
  mainSubscriptionCouponId,
}: {
  institutionId: string;
  customerId: string;
  accessPassCouponId?: string;
  mainSubscriptionCouponId?: string;
}) => {
  return await prisma.institution.update({
    where: {
      id: institutionId,
    },
    data: {
      stripeAccount: {
        upsert: {
          update: {
            customerId: customerId,
            accessPassCouponId,
            mainSubscriptionCouponId,
          },
          create: {
            customerId: customerId,
            accessPassCouponId,
            mainSubscriptionCouponId,
          },
        },
      },
    },
    include: {
      stripeAccount: true,
    },
  });
};

export const updateStripeAccount = async (
  institutionId: string,
  subscription: Stripe.Subscription,
) => {
  await cacheRedisHandler.invalidate.custom({
    prefix: "user-data",
    searchParam: institutionId,
    type: "single",
    origin: "server-stripe/db-requests.ts (updateStripeAccount)",
  });
  await updateOldSubscriptionToNoLongerUsed(institutionId, subscription.id);
  return await prisma.institution.update({
    where: {
      id: institutionId,
    },
    data: {
      stripeAccount: {
        update: {
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
        },
      },
    },
  });
};

export const updateOldSubscriptionToNoLongerUsed = async (
  institutionId: string,
  newSubscriptionId: string,
) => {
  const institutionStripeAccount =
    await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institutionId,
      },
    });

  const subId = institutionStripeAccount?.subscriptionId;

  if (institutionStripeAccount && subId && subId !== newSubscriptionId) {
    try {
      const oldSubscription = await stripe.subscriptions.retrieve(subId);
      if (
        oldSubscription.metadata.isTestInstitution === "true" ||
        oldSubscription.status === "canceled"
      ) {
        await stripe.subscriptions.update(subId, {
          metadata: {
            ...oldSubscription.metadata,
            noLongerUsed: "true",
          },
        });
      }
    } catch (e) {
      const error = e as Error;
      Sentry.captureException(error, {
        data: {
          institutionId,
          newSubscriptionId,
          subId,
        },
      });
      console.error(
        "Error updating old subscription to noLongerUsed",
        error.message,
      );
    }
  }
};

export const updateStripeAccountFromInstitution = async (
  institutionId: string,
  subscription: Stripe.Subscription,
) => {
  let institution = await getInstitutionById(institutionId as string);
  if (institution) {
    institution = await updateStripeAccount(institutionId, subscription);
  }
  return institution;
};

export async function getCurrentInstitutionCustomerId(userId: string) {
  const institution = await getCurrentInstitution(userId);
  if (institution) {
    const response = await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institution.id,
      },
      select: {
        customerId: true,
      },
    });
    if (!response) throw new Error("No current institution set for user");
    return response.customerId;
  }
}

export const getInstitutionStripeAccount = async (
  institutionId: string,
  include?: IncludeType,
) => {
  const includesPaidAddOns = include?.includes("paidAddOns");
  const includesAccessPasses = include?.includes("accessPasses");
  const includesSupportPackage = include?.includes("supportPackage");
  const res = await prisma.institutionStripeAccount.findUnique({
    where: { institutionId: institutionId },
    ...((includesAccessPasses ||
      includesAccessPasses ||
      includesSupportPackage) && {
      include: {
        ...(includesPaidAddOns && { paidAddOns: true }),
        ...(includesAccessPasses && { accessPasses: true }),
        ...(includesSupportPackage && { supportPackage: true }),
      },
    }),
  });
  return res;
};
