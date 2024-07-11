import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import extendSubscriptionOfInstitution from "@/prisma/extend-subscription-of-institution";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";

export type AdminDashExtendInstitutionSubscriptionData = {
  adminDashPassword: string;
  institutionId: string;
  cancelDate: number;
  institutionName: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const {
        institutionName,
        cancelDate,
        institutionId,
        adminDashPassword,
      }: AdminDashExtendInstitutionSubscriptionData = JSON.parse(req.body);

      canAccessAdminDashboard(userId!, adminDashPassword, res);
      const result = await extendSubscriptionOfInstitution({
        environment:
          process.env.SERVER_URL === "https://fuxam.app" ? "prod" : "dev",
        name: institutionName,
        institutionId,
        cancelDate,
      });
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Failed to extend Institution subscription:" +
          (error as Error)?.message,
      });
    }
  }
}
