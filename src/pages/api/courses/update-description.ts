import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";
import { isAdminModeratorOrEducator } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    const course = await prisma.course.findUnique({
      where: { id: data.id },
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId: course.layer_id,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const update = await prisma.course.update({
      where: { id: data.id },
      data: {
        icon: data.icon,
        description: data.description,
      },
    });

    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      type: "single",
      origin: "api/courses/update-description.ts",
      searchParam: course.layer_id,
    });
    res.json(update);
  }
}
