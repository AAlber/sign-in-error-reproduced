import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteScheduleCustomFilter } from "@/src/server/functions/server-schedule-filter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = JSON.parse(req.body);

    const customFilters = await deleteScheduleCustomFilter(id);

    return res.json(customFilters);
  }
}
