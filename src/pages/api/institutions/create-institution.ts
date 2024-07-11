import { clerkClient, getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Theme } from "@/src/client-functions/client-institution-theme";
import { prisma } from "@/src/server/db/client";
import { decrypt } from "@/src/server/functions/server-encryption";
import { updatePartialInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import {
  createStandardSubscription,
  getAccessPassCoupon,
  getMainSubscriptionCoupon,
  getOrCreateStripeAccountForInstitution,
} from "@/src/server/functions/server-stripe";
import { sentry } from "@/src/server/singletons/sentry";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import type { CouponCreateData } from "@/src/utils/stripe-types";

export type CreateInstitutionData = {
  name: string;
  logoLink?: string;
  institutionId?: string;
  standardSubscriptionItem: {
    priceId: string;
    quantity: number;
  };
  gbPerUser: number;
  baseStorageGb: number;
  supportPackagePriceId?: string;
  language: Language;
  accessPassDiscount?: number;
  instiTheme: Theme["name"];
  aiCredits?: number;
  mainSubCouponData?: CouponCreateData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    let createInstitutionData: CreateInstitutionData;
    let successfullyDecrypted = false;
    if (data.paymentSettings) {
      createInstitutionData = JSON.parse(
        decrypt(data.paymentSettings),
      ) as CreateInstitutionData;
      successfullyDecrypted = true;
    } else {
      createInstitutionData = data as CreateInstitutionData;
    }

    const {
      logoLink,
      name,
      instiTheme,
      language,
      standardSubscriptionItem,
      supportPackagePriceId,
      aiCredits,
      gbPerUser,
      baseStorageGb,
      accessPassDiscount,
      mainSubCouponData,
    } = createInstitutionData;

    const { userId } = getAuth(req);

    const [user, accessPassCoupon, mainSubCoupon] = await Promise.all([
      clerkClient.users.getUser(userId!),
      getAccessPassCoupon(accessPassDiscount),
      getMainSubscriptionCoupon(mainSubCouponData),
    ]);

    const email = user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    );

    sentry.setUser({ id: userId!, email: email as unknown as string });

    const institution = await prisma.institution.create({
      data: {
        name: decodeURIComponent(name),
        ...(logoLink ? { logo: logoLink } : {}),
        theme: instiTheme,
        metadata: {
          create: {
            firstAdminEmail: email?.emailAddress as string,
          },
        },
      },
    });

    sentry.setContext("api/institutions/create-institution", {
      data,
      organizationId: institution.id,
      userId,
    });

    const budget = successfullyDecrypted && aiCredits ? aiCredits : 100000;

    const [_, stripeAccount] = await Promise.all([
      prisma.institutionAIUsageStatus.create({
        data: {
          institutionId: institution.id,
          budget,
        },
      }),
      getOrCreateStripeAccountForInstitution({
        institutionId: institution.id,
        userId: userId!,
        institutionName: institution.name,
        ...(accessPassCoupon
          ? { accessPassCouponId: accessPassCoupon?.id }
          : {}),
        ...(mainSubCoupon
          ? { mainSubscriptionCouponId: mainSubCoupon.id }
          : {}),
      }),
    ]);

    await Promise.all([
      updatePartialInstitutionSettings(institution.id, {
        institution_language: language,
        storage_gb_per_user: gbPerUser,
        storage_base_gb: baseStorageGb,
      }),
      prisma.user.update({
        where: {
          id: userId!,
        },
        data: {
          currentInstitution: institution.id,
        },
      }),
      cacheRedisHandler.invalidate.single("user-data", userId!),
    ]);

    const checkoutSessionUrl = await createStandardSubscription(
      stripeAccount!,
      {
        standardSubscriptionItem,
        supportPackagePriceId,
        cancel_url: `${process.env.SERVER_URL}/onboarding/process?previousConfig=${req.body}&deleteInstitutionId=${institution.id}`,
        success_url: `${process.env.SERVER_URL}/onboarding?institutionId=${institution.id}`,
        userId: userId!,
        institutionName: institution.name,
      },
    );

    return res.json(checkoutSessionUrl);
  }
}
