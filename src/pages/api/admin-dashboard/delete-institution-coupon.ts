import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { stripe } from "@/src/server/singletons/stripe";

export type DeleteInstitutionCouponData = {
  adminDashPassword: string;
  institutionId: string;
  type: "main-subscription" | "access-pass";
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
        type,
      }: DeleteInstitutionCouponData = JSON.parse(req.body);
      canAccessAdminDashboard(userId!, adminDashPassword, res);

      if (!userId) {
        return res.status(400).json({ message: "No userId" });
      }
      const stripeAcc = await prisma.institutionStripeAccount.findUnique({
        where: {
          institutionId,
        },
      });
      const couponIdToDelete =
        type === "main-subscription"
          ? stripeAcc?.mainSubscriptionCouponId
          : stripeAcc?.accessPassCouponId;

      console.log("couponIdToDelete", couponIdToDelete);
      await Promise.all([
        prisma.institutionStripeAccount.update({
          where: {
            institutionId,
          },
          data: {
            ...(type === "main-subscription"
              ? { mainSubscriptionCouponId: null }
              : { accessPassCouponId: null }),
          },
        }),
        couponIdToDelete && stripe.coupons.del(couponIdToDelete),
      ]);

      return res.status(200).json("Success");
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
    }
  }
}
