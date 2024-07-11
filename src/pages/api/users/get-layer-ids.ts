import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCurrentInstitutionId,
  getLayerIdsOfUser,
} from "@/src/server/functions/server-user";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      log.info("get layer ids of user");

      const user = getAuth(req);
      const userId = user.userId!;

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId)
        return res.status(400).json({ message: "No institution selected" });

      const isCourse = req.query.isCourse === "true";
      const layerIds = await getLayerIdsOfUser(userId, institutionId, isCourse);
      res.json(layerIds);
    } catch (e) {
      log.error(e);
      return res
        .status(500)
        .json({ success: true, message: "Cannot get layerIds of user" });
    }
  }
}
