import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTimeConstrainingLayer } from "@/src/server/functions/server-administration";
import { groupCoursesByParentLayer } from "@/src/server/functions/server-ects/ects-course-data";
import {
  getCoursesUserHasAccessTo,
  getCurrentInstitutionId,
} from "@/src/server/functions/server-user";
import type { ECTsStructureFlat, ECTsTableItem } from "@/src/types/ects.types";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const type = req.query.type as string;
    const targetUserId = req.query.userId as string;

    if (!userId) return res.status(404).json({ message: "User not found" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    try {
      const courses = (await getCoursesUserHasAccessTo(
        targetUserId,
        institutionId,
        false,
      )) as unknown as ECTsTableItem[];

      if (req.query.includeTimeConstrainingLayer === "true") {
        await Promise.all(
          courses.map(async (course) => {
            const timeConstrainingLayer = await getTimeConstrainingLayer(
              course.layer_id,
            );

            if (timeConstrainingLayer)
              course.timeConstrainingLayer = timeConstrainingLayer;
          }),
        );
      }

      if (type === "flat") {
        const flatStructure: ECTsStructureFlat = {
          type: "flat",
          tableObjects: courses,
        };

        return res.json(flatStructure);
      }

      // else type === grouped
      const groupedStructure = await groupCoursesByParentLayer(courses);
      return res.json(groupedStructure);
    } catch (e) {
      log.error(e);
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
