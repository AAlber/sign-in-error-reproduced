import moment from "moment-timezone";
import usePlanner from "@/src/components/planner/zustand";
import api from "@/src/pages/api/api";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type {
  PlannerLayerWithAvailableResources,
  RequestUnavailablities,
  RequestUnavailablitiesResponse,
} from "@/src/types/planner/planner.types";
import type { PlannerConstraints } from "@/src/types/planner/planner-constraints.types";
import type { PlannerFunctionResponse } from "@/src/types/planner/planner-errors.types";
import { log } from "@/src/utils/logger/logger";

export async function getFixForWarning(
  data: RequestUnavailablities,
): Promise<RequestUnavailablitiesResponse> {
  log.context("RequestUnavailablities", data);

  try {
    const response = await fetch(api.getUnavailabilities, {
      method: "POST",
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      log.response(response);
      throw new Error("Failed to fetch unavailable timeslots");
    }

    const responseData = await response.json();
    log.info("Successfully fetched unavailable timeslots", responseData);
    return responseData;
  } catch (error) {
    log.error(error, "Error fetching unavailable timeslots");
    return { id: data.id, unavailabilities: [] };
  }
}

export async function getUnavailableTimeslots(
  data: RequestUnavailablities,
): Promise<RequestUnavailablitiesResponse> {
  log.context("RequestUnavailablities", data);

  try {
    return log.timespan("Get Unavailable Timeslots", async () => {
      const response = await fetch(api.getUnavailabilities, {
        method: "POST",
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to fetch unavailable timeslots");
      }

      const responseData = await response.json();
      log.info("Successfully fetched unavailable timeslots", responseData);
      return responseData;
    });
  } catch (error) {
    log.error(error, "Error fetching unavailable timeslots");
    return { id: data.id, unavailabilities: [] };
  }
}

export async function getDraftAppointments(
  layers: PlannerLayerWithAvailableResources[],
  constraints: PlannerConstraints,
): Promise<PlannerFunctionResponse<ScheduleAppointment[]>> {
  log.context("RequestDraftAppointments", { layers, constraints });

  const { setDraftAppointments } = usePlanner.getState();
  const constraintsWithValidTimeSlots = constraints.availableTimeSlots.filter(
    (timeSlot) => {
      if (!timeSlot.rrule.options.byweekday) {
        return false;
      } else {
        return timeSlot.rrule.options.byweekday.length > 0;
      }
    },
  );

  if (constraintsWithValidTimeSlots.length === 0) {
    setDraftAppointments([]);
    return {
      ok: false,
      error: {
        severity: "warning",
        cause: "no-weekdays-selected",
        data: {
          message: "No weekdays selected",
        },
      },
    };
  }

  try {
    return log.timespan("Get Draft Appointments", async () => {
      const response = await fetch(api.getDraftAppointments, {
        method: "POST",
        body: JSON.stringify({
          layers,
          constraints: {
            ...constraints,
            availableTimeSlots: constraintsWithValidTimeSlots.map(
              (timeSlot) => {
                return {
                  ...timeSlot,
                  startTime: {
                    hour: timeSlot.startTime.hour - moment().utcOffset() / 60,
                    minute: timeSlot.startTime.minute,
                  },
                  endTime: {
                    hour: timeSlot.endTime.hour - moment().utcOffset() / 60,
                    minute: timeSlot.endTime.minute,
                  },
                  rrule: timeSlot.rrule.toString(),
                };
              },
            ),
          },
        }),
      });

      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to fetch draft appointments");
      }

      const responseData = await response.json();
      log.info("Successfully fetched draft appointments", responseData);
      return responseData;
    });
  } catch (error) {
    log.error(error, "Error fetching unavailable timeslots");
    return {
      ok: false,
      error: {
        severity: "error",
        cause: "unknown-error",
        data: {
          message: "An unknown error occurred while generating appointments",
        },
      },
    };
  }
}
