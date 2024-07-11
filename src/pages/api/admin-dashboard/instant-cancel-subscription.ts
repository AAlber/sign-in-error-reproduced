import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { stripe } from "@/src/server/singletons/stripe";

export type AdminDashInstantCancelSubscription = {
  adminDashPassword: string;
  institutionId: string;
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
      }: AdminDashInstantCancelSubscription = JSON.parse(req.body);

      canAccessAdminDashboard(userId!, adminDashPassword, res);
      const stripeAcc = await prisma.institutionStripeAccount.findUnique({
        where: {
          institutionId,
        },
      });
      await stripe.subscriptions.cancel(stripeAcc?.subscriptionId as string);
      res.status(200).json("Successfully Cancelled");
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Failed to instant cancel Institution subscription:" +
          (error as Error)?.message,
      });
    }
  }
}
