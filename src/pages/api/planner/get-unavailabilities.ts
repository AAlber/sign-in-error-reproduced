import type { NextApiRequest, NextApiResponse } from "next";
import { getFutureUnavailableTimeSlots } from "@/src/server/functions/server-planner/server-planner-unavailabilities";
import type {
  RequestUnavailablities,
  RequestUnavailablitiesResponse,
} from "@/src/types/planner/planner.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestUnavailablitiesResponse | { message: any }>,
) {
  if (req.method === "POST") {
    try {
      const { data } = JSON.parse(req.body) as {
        data: RequestUnavailablities;
      };

      log.context("RequestUnavailablities", data);

      if (!data) {
        log.warn("No data provided");
        return res.status(403).json({ message: "No data provided" });
      }

      const unavailabilities = await getFutureUnavailableTimeSlots(data);

      return res.status(200).json({
        id: data.id,
        unavailabilities,
      });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: error });
    }
  } else {
    log.warn("Method not allowed");
    res.status(405).end();
  }
}
