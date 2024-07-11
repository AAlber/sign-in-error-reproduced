import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCoursesUserHasAccessTo } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    if (!userId) return res.status(404).json({ message: "User not found" });

    sentry.setUser({ userId });
    sentry.setContext("api/administration/get-courses-user-has-access-to", {
      userId,
    });

    if (!userId) return res.status(403).json({ error: "No userid" });

    const courses = await getCoursesUserHasAccessTo(userId);
    return res.json(courses);
  }
}
