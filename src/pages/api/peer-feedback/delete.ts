import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { id } = req.query as any as { id: string };
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const feedback = await prisma.peerFeedback.findUnique({ where: { id } });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.reviewerId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !(await hasRolesWithAccess({
        layerIds: [feedback.layerId],
        userId,
        rolesWithAccess: ["admin", "moderator", "educator", "member"],
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.peerFeedback.delete({ where: { id } });

    return res.json({ message: "Feedback deleted" });
  }
}
