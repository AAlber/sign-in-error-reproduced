import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getScheduleCustomFilters } from "@/src/server/functions/server-schedule-filter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const customFilters = await getScheduleCustomFilters(userId);

    return res.json(customFilters);
  }
}
