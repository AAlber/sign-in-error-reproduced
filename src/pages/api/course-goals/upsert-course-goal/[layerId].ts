import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { upsertCourseGoal } from "@/src/server/functions/server-course-goals";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

/** creates or updates a course goal for a layerId */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const layerId = req.query.layerId as string;
    const body = JSON.parse(req.body) as Omit<UpsertCourseGoalArgs, "layerId">;

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

    await upsertCourseGoal({ layerId, ...body });
    res.json({ success: true });
  }
}

export type UpsertCourseGoalArgs = {
  layerId: string;
  attendanceGoal?: number;
  points?: number;
  contentBlockId?: string;
};
