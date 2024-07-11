import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import {
  hasAccessToLayer,
  isAdminOrModerator,
} from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const layerId = req.query.layerId as string;
    const blockId = req.query.blockId as string;

    if (!layerId || !blockId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "UNAUTHORIZED" });

    const isAuthorized = hasAccessToLayer({ userId, layerId });
    if (!isAuthorized) return res.status(401).json({ message: "UNAUTHORIZED" });

    /**
     * If the user is a moderator, get average of contentBlock feedback,
     * else only get user own feedback
     */
    const isMod = await isAdminOrModerator({ userId, layerId });
    if (isMod) {
      const [resultAvg, resultSelf] = await Promise.all([
        prisma.contentBlockFeedback.aggregate({
          _avg: {
            rating: true,
          },
          where: {
            blockId,
          },
          _count: { blockId: true },
        }),
        await prisma.contentBlockFeedback.findFirst({
          where: { blockId, userId },
        }),
      ]);

      return res.json({ ...resultAvg, ...resultSelf });
    }
    const result = await prisma.contentBlockFeedback.findFirst({
      where: { blockId, userId },
    });

    res.json(result);
  } catch (e) {
    const err = e as Error;
    res.json({ message: err.message });
  }
}
