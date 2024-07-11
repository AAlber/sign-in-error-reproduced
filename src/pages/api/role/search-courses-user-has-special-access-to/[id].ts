import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchCoursesUserHasSpecialAccessTo } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const search = req.query.search as string;
    const { userId } = getAuth(req);

    const courses = await searchCoursesUserHasSpecialAccessTo(userId!, search);
    res.json(courses);
  }
}
