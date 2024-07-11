import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { UpdateInstitutionGeneralInfoData } from "@/src/types/server/institution.types";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data: UpdateInstitutionGeneralInfoData = JSON.parse(req.body);
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(401).json({ message: "Unauthorized" });
    if (!(await isAdminOfInstitution(userId!, institutionId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const update = await prisma.institution.update({
      where: { id: institutionId },
      data: {
        logo: data.logoLink,
        name: data.name,
      },
    });

    await cacheRedisHandler.invalidate.custom({
      prefix: "user-data",
      searchParam: update.id,
      type: "single",
      origin: "api/institutions/update-institution.ts",
    });
    return res.json(update);
  }
}
