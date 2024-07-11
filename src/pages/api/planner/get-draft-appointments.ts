import type { NextApiRequest, NextApiResponse } from "next";
import { rrulestr } from "rrule";
import { generateDraftAppointments } from "@/src/server/functions/server-planner/server-planner-functions";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { PlannerLayerWithAvailableResources } from "@/src/types/planner/planner.types";
import type { PlannerConstraints } from "@/src/types/planner/planner-constraints.types";
import type { PlannerFunctionResponse } from "@/src/types/planner/planner-errors.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    PlannerFunctionResponse<ScheduleAppointment[]> | { message: any }
  >,
) {
  if (req.method === "POST") {
    try {
      const { layers, constraints } = JSON.parse(req.body) as {
        layers: PlannerLayerWithAvailableResources[];
        constraints: PlannerConstraints;
      };

      log.context("APIRequestUnavailablities", { layers, constraints });

      if (!layers || !constraints) {
        log.warn("No data provided");
        return res.status(403).json({ message: "No data provided" });
      }

      const availableTimeSlots = constraints.availableTimeSlots.map(
        (timeSlot) => {
          return {
            ...timeSlot,
            rrule: rrulestr(timeSlot.rrule as any),
          };
        },
      );

      const response = generateDraftAppointments(layers, {
        ...constraints,
        availableTimeSlots,
      });

      return res.status(200).json(response);
    } catch (error) {
      log.error(error).cli();
      res.status(500).json({ message: error });
    }
  } else {
    log.warn("Method not allowed");
    res.status(405).end();
  }
}
