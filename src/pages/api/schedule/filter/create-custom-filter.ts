import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { createScheduleCustomFilter } from "@/src/server/functions/server-schedule-filter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const { layerIds, name } = JSON.parse(req.body);

    const result = await createScheduleCustomFilter(layerIds, userId!, name);

    return res.json(result);
  }
}
