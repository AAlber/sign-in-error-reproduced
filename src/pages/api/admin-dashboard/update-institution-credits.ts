import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CreditEditData } from "@/src/components/admin-dashboard/table/institution-overview-sheet/edit-institution-credit";
import { prisma } from "@/src/server/db/client";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { updatePartialInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import {
  getAccessPassCoupon,
  getMainSubscriptionCoupon,
} from "@/src/server/functions/server-stripe";
import { stripe } from "@/src/server/singletons/stripe";
import type { CouponCreateData } from "@/src/utils/stripe-types";

export type AdminDashCreateInstitutionData = {
  adminDashPassword: string;
  email: string;
  name: string;
  amountOfSubscriptionMonths?: number;
  language: "en" | "de";
  aiCredits: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const {
        institutionId,
        adminDashPassword,
        baseStorageGb,
        gbPerUser,
        accessPassDiscount,
        aiCredits,
        mainSubCouponData,
      }: CreditEditData & { adminDashPassword: string; institutionId: string } =
        JSON.parse(req.body);
      canAccessAdminDashboard(userId!, adminDashPassword, res);

      if (!userId) {
        return res.status(400).json({ message: "No userId" });
      }
      (baseStorageGb || gbPerUser) &&
        (await updatePartialInstitutionSettings(institutionId, {
          ...(baseStorageGb ? { storage_base_gb: baseStorageGb } : {}),
          ...(gbPerUser ? { storage_gb_per_user: gbPerUser } : {}),
        }));

      aiCredits &&
        (await prisma.institutionAIUsageStatus.update({
          where: { institutionId },
          data: {
            institutionId: institutionId,
            budget: aiCredits,
          },
        }));

      const [couponData, stripeAccount] = await Promise.all([
        createInstitutionCoupons({ accessPassDiscount, mainSubCouponData }),
        prisma.institutionStripeAccount.findUnique({
          where: { institutionId },
        }),
      ]);
      const { accessPassCoupon, mainSubscriptionCoupon } = couponData;

      accessPassCoupon &&
        (await Promise.all([
          prisma.institutionStripeAccount.update({
            where: {
              institutionId,
            },
            data: { accessPassCouponId: accessPassCoupon.id },
          }),
          stripeAccount?.accessPassCouponId &&
            stripe.coupons.del(stripeAccount.accessPassCouponId),
        ]));

      mainSubscriptionCoupon &&
        (await Promise.all([
          prisma.institutionStripeAccount.update({
            where: {
              institutionId,
            },
            data: { mainSubscriptionCouponId: mainSubscriptionCoupon.id },
          }),
          stripeAccount?.mainSubscriptionCouponId &&
            stripe.coupons.del(stripeAccount.mainSubscriptionCouponId),
        ]));

      return res.status(200).json("Success");
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
    }
  }
}

export const createInstitutionCoupons = async ({
  accessPassDiscount,
  mainSubCouponData,
}: {
  accessPassDiscount?: number;
  mainSubCouponData?: CouponCreateData;
}) => {
  const accessPassCoupon = await getAccessPassCoupon(accessPassDiscount);
  const mainSubscriptionCoupon =
    await getMainSubscriptionCoupon(mainSubCouponData);
  return { accessPassCoupon, mainSubscriptionCoupon };
};
