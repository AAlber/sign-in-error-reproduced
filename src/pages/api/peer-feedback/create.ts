import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId, layerId, text, rating } = JSON.parse(req.body);
    const { userId: requestUserId } = getAuth(req);

    if (!userId || !layerId || rating === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!requestUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !(await hasRolesWithAccess({
        layerIds: [layerId],
        userId: requestUserId,
        rolesWithAccess: ["admin", "moderator", "educator", "member"],
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingFeedback = await prisma.peerFeedback.findFirst({
      where: {
        userId,
        layerId,
        reviewerId: requestUserId,
      },
    });

    if (!existingFeedback) {
      await prisma.peerFeedback.create({
        data: { userId, layerId, text, rating, reviewerId: requestUserId },
      });
    } else {
      await prisma.peerFeedback.update({
        where: { id: existingFeedback.id },
        data: { text, rating, updatedAt: new Date() },
      });
    }

    //TODO: Send notification

    return res.json({ message: "Feedback saved" });
  }
}
