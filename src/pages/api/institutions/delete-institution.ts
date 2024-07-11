import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAllInstitutionData } from "@/src/server/functions/server-institutions";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    try {
      if (!userId)
        return res.status(400).json({ message: "No user id provided" });

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId)
        return res.status(400).json({ message: "No institution id provided" });

      if (!(await isAdminOfInstitution(userId, institutionId)))
        return res.status(401).json({ message: "Unauthorized" });

      const update = await deleteAllInstitutionData(userId, institutionId!);
      await cacheRedisHandler.invalidate.custom({
        prefix: "user-data",
        searchParam: institutionId,
        origin: "api/institutions/delete-institution.ts",
        type: "single",
      });

      res.json(update);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}
