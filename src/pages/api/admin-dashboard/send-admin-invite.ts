import { getAuth } from "@clerk/nextjs/server";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { createSingleEmailInvite } from "@/src/server/functions/server-invite";

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
      const { institutionId, adminDashPassword, email } = JSON.parse(req.body);
      canAccessAdminDashboard(userId!, adminDashPassword, res);

      if (!userId) {
        return res.status(400).json({ message: "No userId" });
      }
      const language = (await getInstitutionSettings(institutionId))
        .institution_language;

      const result = await createSingleEmailInvite({
        email: email,
        institutionId: institutionId,
        layerId: institutionId,
        role: "admin",
        token: cuid(),
        // userId: userId,
        language,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
    }
  }
}
