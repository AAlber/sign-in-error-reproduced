import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { setInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    if (!data.settings)
      return res.status(400).json({ message: "No settings provided" });

    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (!(await isAdminOfInstitution(userId!, institutionId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await setInstitutionSettings(institutionId, data.settings);
    await cacheRedisHandler.invalidate.custom({
      prefix: "user-data",
      searchParam: institutionId,
      type: "single",
      origin: "api/institution-settings/update-institution-settings.ts",
    });
    res.json(request);
  }
}
