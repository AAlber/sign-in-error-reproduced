import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const data = req.query as { userId: string };

      const currentUser = getAuth(req);
      const currentInstitutionId = await getCurrentInstitutionId(
        currentUser.userId!,
      );

      if (!currentInstitutionId) {
        log.warn("User institution not found");
        return res.status(404).json({ message: "User institution not found" });
      }

      const userNotes = await prisma.userNotes.findMany({
        where: {
          userId: data.userId,
          institutionId: currentInstitutionId,
        },
      });

      return res.json(userNotes);
    } catch (e: any) {
      log.error(e);
      res.status(500).json({ message: e.message });
      throw new Error(
        "Couldn't find user notes or user institution:" + e.message,
      );
    }
  }
}
