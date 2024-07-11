import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const courseGoalId = req.query.id as string;
    const { userId } = getAuth(req);

    const courseGoal = await prisma.contentBlockCourseGoal.findUniqueOrThrow({
      where: {
        id: courseGoalId,
      },
    });

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId: courseGoal.layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await prisma.contentBlockCourseGoal.delete({ where: { id: courseGoalId } });
    res.json({ success: true });
  }
}
