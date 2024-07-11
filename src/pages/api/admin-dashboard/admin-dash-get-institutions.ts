import { getAuth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { undefined } from "zod";
import { prisma } from "@/src/server/db/client";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { getTotalActiveUsersOfInstitution } from "@/src/server/functions/server-role";
import { convertToFuxamAdminDashSubscription } from "@/src/server/functions/server-stripe";
import { stripe } from "@/src/server/singletons/stripe";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      canAccessAdminDashboard(
        userId!,
        req.query.adminDashPassword as string,
        res,
      );
      const subscriptions: Stripe.Subscription[] = [];
      const [institutions] = await Promise.all([
        prisma.institution.findMany({
          include: {
            stripeAccount: true,
            metadata: true,
            users: true,
            accessPasses: true,
            invite: true,
            supportPackage: {
              select: {
                priceId: true,
              },
            },
          },
        }),
        stripe.subscriptions
          .list({
            limit: 100,
            status: "all",
          })
          .autoPagingEach((item) => {
            subscriptions.push(item);
          }),
        stripe.subscriptions
          .list({ limit: 100, status: "canceled" })
          .autoPagingEach((item) => {
            subscriptions.push(item);
          }),
      ]);

      async function enhanceInstitutionsWithUserCounts(
        institutions,
        subscriptions,
      ) {
        // First map the institutions to promises that resolve with all needed details.
        const institutionPromises = institutions.map(async (institution) => {
          const subscriptionIdFromStripeAccount =
            institution.stripeAccount?.subscriptionId;
          const subscriptionFromList = subscriptions.find((subscription) => {
            return subscription.id === subscriptionIdFromStripeAccount;
          });
          const subscription = subscriptionIdFromStripeAccount
            ? subscriptionFromList
            : null;
          const user = institution.metadata?.firstAdminEmail
            ? institution.users.find(
                (user) => user.email === institution.metadata?.firstAdminEmail,
              )
            : undefined;
          // Call the async function within the map callback
          const [totalUsers, aiStatus, institutionSettings] = await Promise.all(
            [
              getTotalActiveUsersOfInstitution(institution.id, true),
              prisma.institutionAIUsageStatus.findUnique({
                where: {
                  institutionId: institution.id as string,
                },
                select: {
                  budget: true,
                },
              }),
              prisma.institutionSettings.findUnique({
                where: {
                  institutionId: institution.id as string,
                },
                select: {
                  settings: true,
                },
              }),
              prisma.institutionStripeAccount.findUnique({
                where: {
                  institutionId: institution.id as string,
                },
                select: {
                  accessPassCouponId: true,
                },
              }),
            ],
          ); // replace institution.id with actual identifier if different
          const settings = institutionSettings?.settings as
            | InstitutionSettings
            | undefined;
          return {
            institution,
            subscription: convertToFuxamAdminDashSubscription(subscription),
            signedInAt:
              user && user.memberSince
                ? dayjs(user.memberSince).format("DD MM YY")
                : "Not signed in yet",
            totalUsers, // add the user count to the resulting object
            credits: {
              aiCredits: aiStatus?.budget || 0,
              baseStorageGb: settings?.storage_base_gb || 0,
              gbPerUser: settings?.storage_gb_per_user || 0,
              accessPassCouponId:
                institution.stripeAccount?.accessPassCouponId || undefined,
            },
            // aiCreditr,
            // settings: settings?.settings
          };
        });

        // Then use Promise.all to wait for all promises to resolve.
        return Promise.all(institutionPromises);
      }
      const institutionsWithUserCounts =
        await enhanceInstitutionsWithUserCounts(institutions, subscriptions);

      const resultArray = institutionsWithUserCounts.sort((a, b) => {
        // Set a default date far in the past for institutions without metadata or createdAt
        const defaultDate = new Date(0); // Unix epoch start, it's the oldest time possible
        const dateA: any =
          a.institution.metadata && a.institution.metadata.createdAt
            ? new Date(a.institution.metadata.createdAt)
            : defaultDate;
        const dateB: any =
          b.institution.metadata && b.institution.metadata.createdAt
            ? new Date(b.institution.metadata.createdAt)
            : defaultDate;

        // Compare the dates for descending order
        return dateB - dateA;
      });

      res.status(200).json(resultArray);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to get Institutions:" + (error as Error)?.message,
      });
    }
  }
}
