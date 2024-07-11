import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import {
  getUsersWithAccess,
  hasRolesWithAccess,
} from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { layerId } = req.query as any as { layerId: string };
    const { userId } = getAuth(req);

    if (!layerId) {
      return res.status(400).json({ message: "Layer ID is required" });
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

    const feedbacks = await prisma.peerFeedback.findMany({
      where: { layerId },
      select: {
        id: true,
        userId: true,
        rating: true,
        reviewerId: true,
      },
    });

    const users = await getUsersWithAccess({
      layerId,
      roleFilter: ["educator", "member"],
    });

    const usersWithFeedbacks = users
      .filter((user) => {
        return user.id !== userId;
      })
      .map((user) => {
        const feedbacksForUser = feedbacks.filter(
          (feedback) => feedback.userId === user.id,
        );

        return {
          ...user,
          feedbacks: feedbacksForUser,
        };
      });

    return res.json(usersWithFeedbacks);
  }
}
