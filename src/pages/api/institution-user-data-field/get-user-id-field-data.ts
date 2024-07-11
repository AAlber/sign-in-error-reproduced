import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getFieldsToShowInUserIdCard } from "@/src/server/functions/server-institution-user-data-field";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      if (!userId) return res.status(403).json({ success: false });

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId)
        return res
          .status(404)
          .json({ success: false, message: "Institution not found" });

      const fieldsToShowInIDCard =
        await getFieldsToShowInUserIdCard(institutionId);

      res.json(fieldsToShowInIDCard);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
