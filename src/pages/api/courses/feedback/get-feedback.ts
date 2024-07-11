import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminOrModerator } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const name = req.query.name as string;
    const layerId = req.query.layerId as string;
    if (!layerId) return res.status(400).json({ message: "Invalid request" });

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "UNAUTHORIZED" });

    /**
     * If the user is a moderator, get all feedbacks,
     * else only get user own feedback
     */
    const isMod = await isAdminOrModerator({ userId, layerId });
    const result = isMod
      ? await prisma.courseFeedback.findMany({
          where: {
            layerId,
            ...(name ? { user: { name: { contains: name } } } : {}),
          },
          include: { user: true },
          orderBy: { updatedAt: "desc" },
        })
      : await prisma.courseFeedback.findFirst({
          where: { layerId, userId },
        });

    res.json(result);
  } catch (e) {
    const err = e as Error;
    res.json({ message: err.message });
  }
}
