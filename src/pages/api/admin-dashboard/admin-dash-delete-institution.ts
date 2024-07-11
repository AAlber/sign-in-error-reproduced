import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { deleteInstitution } from "@/src/server/functions/server-institutions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const { institutionIds, adminDashPassword } = JSON.parse(req.body);

      canAccessAdminDashboard(userId!, adminDashPassword, res);
      const result = await Promise.all(
        institutionIds.map((id) => deleteInstitution(id)),
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
