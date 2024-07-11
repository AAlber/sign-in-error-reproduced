import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { encrypt } from "@/src/server/functions/server-encryption";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const { paymentSettings, adminDashPassword } = JSON.parse(req.body);
      canAccessAdminDashboard(userId!, adminDashPassword, res);
      const encryptedCreateInstitutionData = encrypt(
        JSON.stringify(paymentSettings),
      );
      return res.status(200).json(encryptedCreateInstitutionData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to get Institutions:" + (error as Error)?.message,
      });
    }
  }
}
