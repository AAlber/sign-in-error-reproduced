import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: "No authorization token" });
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      return res.status(401).send({ message: "Invalid authorization token" });
    }

    const userId = req.query.id as string;

    if (!userId) return res.status(400).json({ message: "No id provided" });

    const currentInstitutionId = await getCurrentInstitutionId(userId);

    if (!currentInstitutionId) return res.json([]);

    const roles = await prisma.role.findMany({
      where: {
        userId: userId,
        institutionId: currentInstitutionId,
      },
      select: {
        layerId: true,
        role: true,
      },
    });

    res.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=1, stale-while-revalidate",
    );

    return res.json(roles);
  }
}
