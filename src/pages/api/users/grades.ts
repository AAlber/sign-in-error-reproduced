import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserCourseGrades } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const data = req.query as { layerId?: string };
    const { layerId } = data;

    const grades = await getUserCourseGrades({
      userId: userId!,
      layerId,
    });
    return res.json(grades);
  }
}
