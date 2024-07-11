import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUnfilledUserDataFieldsOfUser } from "@/src/server/functions/server-institution-user-data-field";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        log.error("No user id provided");
        return res
          .status(403)
          .json({ success: false, message: "No user id provided" });
      }

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId) {
        log.error("Institution not found");
        return res
          .status(403)
          .json({ success: false, message: "No institution id provided" });
      }
      log.info(
        `Getting unfilled user data fields of user ${userId} in institution ${institutionId}`,
      );
      const data = await getUnfilledUserDataFieldsOfUser(userId, institutionId);
      res.json(data);
    } catch (error) {
      log.error(error);
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
