/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */
import type { InstitutionTheme, Invite } from "@prisma/client";
import cuid from "cuid";
import { StreamChat } from "stream-chat";
import Stripe from "stripe";
import {
  convertToFuxamAdminDashSubscription,
  getAccessPassCoupon,
  getMainSubscriptionCoupon,
} from "@/src/server/functions/server-stripe";
import type {
  AdminDashInstitution,
  CouponCreateData,
} from "@/src/utils/stripe-types";
import type { StreamChatGenerics } from "../src/components/reusable/page-layout/navigator/chat/types";
import { prisma } from "../src/server/db/client";
import { defaultInstitutionSettings } from "../src/types/institution-settings.types";

type Course = {
  icon: string;
  name: string;
  description: string;
};

export const streamChat = new StreamChat<StreamChatGenerics>(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET,
);

function addMonthsOrYearsToCurrentTimestamp(amount: number): number {
  const date = new Date(); // This gets the current date and time
  date.setMonth(date.getMonth() + amount);

  return Math.floor(date.getTime() / 1000);
}

export default async function createInstitution({
  environment,
  userIdToBeAdmin,
  name,
  language,
  amountOfSubscriptionMonths,
  firstAdminEmail,
  theme,
  logo,
  aiCredits = 100000,
  gbPerUser = 3,
  baseStorageGb = 25,
  accessPassDiscount,
  mainSubCouponData,
}: {
  environment: "dev" | "prod";
  name: string;
  language: "en" | "de";
  theme?: string;
  userIdToBeAdmin?: string;
  amountOfSubscriptionMonths?: number;
  firstAdminEmail: string;
  logo?: string;
  aiCredits?: number;
  gbPerUser?: number;
  baseStorageGb?: number;
  accessPassDiscount?: number;
  mainSubCouponData?: CouponCreateData;
}) {
  console.log("logoeee", logo);
  const productionDefaultPriceId = "price_1OISTjEwHpTUe8W7br5dBw0D";
  const devDefaultPriceId = "price_1OIRpaEwHpTUe8W7zWHnSGDq";
  const defaultPriceId =
    environment === "prod" ? productionDefaultPriceId : devDefaultPriceId;
  const productionPriceId = "price_1NH6bUEwHpTUe8W7TvUQfDKg";
  const devPriceId = "price_1NFxumEwHpTUe8W7ylkfurKF";
  const selectedPriceID =
    environment === "prod" ? productionPriceId : devPriceId;
  const finalPriceId = amountOfSubscriptionMonths
    ? selectedPriceID
    : defaultPriceId;

  const devCouponId = "u9lyD8PG";
  const productionCouponId = "2PIL5bmO";
  const selectedCouponId =
    environment === "prod" ? productionCouponId : devCouponId;

  try {
    const [institution, accessPassCoupon, mainSubCoupon] = await Promise.all([
      prisma.institution.create({
        data: {
          name,
          theme: theme as InstitutionTheme,
          logo,
          metadata: { create: { firstAdminEmail } },
        },
      }),
      getAccessPassCoupon(accessPassDiscount),
      getMainSubscriptionCoupon(mainSubCouponData),
    ]);

    const [_, rolesOfUser, stripe] = await Promise.all([
      prisma.institutionAIUsageStatus.create({
        data: { institutionId: institution.id, budget: aiCredits },
      }),
      userIdToBeAdmin
        ? prisma.role.findMany({
            where: { userId: userIdToBeAdmin },
            select: { layerId: true },
          })
        : Promise.resolve([]),
      new Stripe(process.env.STRIPE_SK!, { apiVersion: "2024-04-10" }),
    ]);

    const institutionsOfUser = userIdToBeAdmin
      ? (await prisma.institution.findMany()).filter((institution) =>
          rolesOfUser.some((role) => role.layerId === institution.id),
        )
      : [];

    const teams = institutionsOfUser.map((i) => i.id);

    const [rootLayer, stripeCustomer] = await Promise.all([
      prisma.layer.create({
        data: {
          id: institution.id,
          name,
          institution_id: institution.id,
          parent_id: null,
          isCourse: false,
          start: null,
          end: null,
        },
      }),
      stripe.customers.create({ name }),
    ]);

    if (userIdToBeAdmin) {
      await Promise.all([
        streamChat.upsertUser({
          id: userIdToBeAdmin,
          teams,
        }),
        streamChat
          .channel("team", institution.id, {
            team: institution.id,
            created_by_id: userIdToBeAdmin,
            members: [userIdToBeAdmin],
            name: institution.name,
          })
          .create(),
        prisma.role.createMany({
          data: [
            {
              role: "member",
              institutionId: institution.id,
              layerId: institution.id,
              userId: userIdToBeAdmin,
            },
            {
              role: "admin",
              institutionId: institution.id,
              layerId: institution.id,
              userId: userIdToBeAdmin,
            },
            {
              role: "moderator",
              institutionId: institution.id,
              layerId: rootLayer.id,
              userId: userIdToBeAdmin,
            },
          ],
        }),
      ]);
    }

    const [stripeSubscription] = await Promise.all([
      stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: finalPriceId, quantity: 50 }],
        metadata: { institutionId: institution.id, isTestInstitution: "true" },
        coupon: selectedCouponId,
        ...(amountOfSubscriptionMonths
          ? {
              cancel_at: addMonthsOrYearsToCurrentTimestamp(
                amountOfSubscriptionMonths,
              ),
            }
          : { cancel_at_period_end: true }),
      }),
      prisma.institutionSettings.upsert({
        where: { institutionId: institution.id },
        create: {
          institutionId: institution.id,
          settings: {
            ...defaultInstitutionSettings,
            institution_language: language,
            storage_base_gb: baseStorageGb,
            storage_gb_per_user: gbPerUser,
            addon_room_management: true,
          },
        },
        update: {
          settings: {
            ...defaultInstitutionSettings,
            addon_room_management: true,
            institution_language: language,
            storage_gb_per_user: gbPerUser,
            storage_base_gb: baseStorageGb,
          },
        },
      }),
    ]);

    const stripeAcc = await prisma.institutionStripeAccount.create({
      data: {
        institutionId: institution.id,
        customerId: stripeCustomer.id,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
        ...(accessPassCoupon
          ? { accessPassCouponId: accessPassCoupon?.id }
          : {}),
        ...(mainSubCoupon
          ? { mainSubscriptionCouponId: mainSubCoupon?.id }
          : {}),
      },
    });

    const invite: Invite = {
      email: firstAdminEmail,
      institution_id: institution.id,
      target: institution.id,
      createdAt: new Date(),
      hasBeenUsed: false,
      validFor24h: false,
      role: "admin",
      token: cuid(),
      accessPassId: null,
      id: cuid(),
    };

    const fullAdminDashInstitution = {
      ...institution,
      logo,
      theme,
      stripeAccount: stripeAcc,
      invite: [invite],
      metadata: {
        firstAdminEmail,
        createdAt: new Date(),
        signedInAt: null,
      },
    };

    const result: AdminDashInstitution = {
      institution: fullAdminDashInstitution,
      subscription: convertToFuxamAdminDashSubscription(stripeSubscription),
      credits: {
        accessPassCouponId: accessPassCoupon?.id,
        baseStorageGb,
        gbPerUser,
        aiCredits,
      },
      signedInAt: "Not signed in yet",
      totalUsers: 0,
    };

    return result;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function createCourseLobby(args: {
  /**
   * The Channel ID
   */
  layerId: string;
  /**
   * The Channel name
   */
  courseName: string;
  /**
   * The `owner` (course creator) of the channel
   */
  userId: string;
  /**
   * The `team` this course should belong to
   */
  institutionId: string;
  /**
   * Optional meta
   */
  image?: string;
  institutionName?: string;
}) {
  const { layerId, courseName, userId, institutionId, institutionName, image } =
    args;
  const _channel = streamChat.channel("course", layerId, {
    created_by_id: userId,
    team: institutionId,
  });

  await _channel.create();
  await _channel.update({
    name: courseName,
    team: institutionId,
    ...(image ? { image } : {}),
    ...(institutionName ? { institution_name: institutionName } : {}),
  });

  return;
}
