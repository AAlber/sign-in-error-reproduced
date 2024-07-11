import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { deleteAllInstitutionData } from "@/src/server/functions/server-institutions";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    console.log("Deleting all test institutions");
    const { userId } = getAuth(req);

    try {
      if (!userId)
        return res.status(400).json({ message: "No user id provided" });

      const institutions = await prisma.institution.findMany({
        where: {
          name: {
            contains: "test_cypress_orga_dev",
          },
          AND: {
            roles: {
              some: {
                userId: userId,
                role: "admin",
              },
            },
          },
        },
      });

      for (const institution of institutions) {
        console.log("Deleting institution: ", institution.name);
        await deleteAllInstitutionData(userId, institution.id!);
        await cacheHandler.invalidate.custom({
          prefix: "user-data",
          searchParam: institution.id!,
          origin: "api/institutions/delete-institution.ts",
          type: "single",
        });
      }

      res.json("Deleted all test institutions");
    } catch (e: any) {
      console.log("error: ", e);
      res.status(500).json({ message: e.message });
    }
  }
}
