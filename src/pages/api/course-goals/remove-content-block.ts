import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

/** removes a contentBlock from a course's goal */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { layerId, blockId } = JSON.parse(req.body) as Body;
    const { userId } = getAuth(req);

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await prisma.contentBlockCourseGoal.update({
      where: { layerId },
      data: { blockGoals: { disconnect: { id: blockId } } },
    });

    res.json({ success: true });
  }
}

type Body = {
  layerId: string;
  blockId: string;
};
