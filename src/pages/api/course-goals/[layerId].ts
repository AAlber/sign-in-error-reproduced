import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

/** fetch single course goal of a layerId */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const layerId = req.query.layerId as string;
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

    const courseGoal = await prisma.contentBlockCourseGoal.findUnique({
      where: { layerId },
      include: {
        blockGoals: true,
      },
    });

    res.json(courseGoal);
  }
}
