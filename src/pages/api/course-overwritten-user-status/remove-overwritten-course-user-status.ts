import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getOverwriteCourseUserStatus,
  removeOverwrittenCourseUserStatus,
} from "@/src/server/functions/server-course-overwritten-user-status";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as RemoveOverwriteCourseUserStatus;

    const { userId } = getAuth(req);

    const overwrittenStatus = await getOverwriteCourseUserStatus(data.id);

    if (!overwrittenStatus) {
      res.status(200).json({ message: "Status not found" });
      return;
    }

    const hasAccess = await hasRolesWithAccess({
      rolesWithAccess: ["admin", "moderator", "educator"],
      userId: userId!,
      layerIds: [overwrittenStatus.layerId],
    });

    if (!hasAccess) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const status = await removeOverwrittenCourseUserStatus(data);

    await cacheHandler.invalidate.single(
      "user-courses-with-progress-data",
      overwrittenStatus.userId,
    );

    res.status(201).json(status);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
