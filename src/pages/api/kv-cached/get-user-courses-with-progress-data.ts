import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserCoursesWithProgressData } from "@/src/server/functions/server-course/dashboard-course-grid";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        courses: CourseWithDurationAndProgress[];
      }
    | { message: any }
  >,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "GET") {
    try {
      const userId = req.query.userId as string;

      if (!req.headers.authorization) {
        return res.status(401).send({ message: "No authorization token" });
      }

      if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
        return res.status(401).send({ message: "Invalid authorization token" });
      }

      Sentry.setContext("user", { userId });

      if (!userId)
        return res.status(403).json({ message: "No user id provided" });

      if (!userId) return res.status(400).json({ message: "No id provided" });

      const courseWithUserProgress =
        await getUserCoursesWithProgressData(userId);

      await cacheHandler.set("user-courses-with-progress-data", userId, {
        courses: courseWithUserProgress,
      });
      return res.status(200).json({
        courses: courseWithUserProgress,
      });
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: error });
    }
  } else {
    res.status(405).end();
  }
}
