import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { layerId, targetUserId, reviewerId } = req.query as any as {
      layerId: string;
      targetUserId: string;
      reviewerId: string;
    };
    const { userId } = getAuth(req);

    if (!layerId) {
      return res.status(400).json({ message: "Layer ID is required" });
    }

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required" });
    }

    if (!reviewerId) {
      return res.status(400).json({ message: "Reviewer ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !(await hasRolesWithAccess({
        layerIds: [layerId],
        userId: userId!,
        rolesWithAccess: ["admin", "moderator", "educator", "member"],
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const feedback = await prisma.peerFeedback.findFirst({
      where: {
        layerId,
        userId: targetUserId,
        reviewerId,
      },
      select: {
        id: true,
        userId: true,
        text: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        reviewer: true,
      },
    });

    return res.json(feedback);
  }
}
