import cuid from "cuid";
import dayjs from "dayjs";
import { rrulestr } from "rrule";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type {
  AvailableTimeFrame,
  AvailableTimeFrameWithResources,
  LayerWithAvailableTimeFrames,
  LayerWithAvailableTimeFramesAndAvailableResources,
  PlannerLayerWithAvailableResources,
  Resource,
  TimeFrame,
} from "@/src/types/planner/planner.types";
import type { PlannerConstraints } from "@/src/types/planner/planner-constraints.types";
import type {
  PlannerError,
  PlannerErrorCause,
  PlannerFunctionResponse,
} from "@/src/types/planner/planner-errors.types";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";
import { log } from "@/src/utils/logger/logger";

/**
 * This function creates a planner error response with the given cause and data.
 * If the cause is "unknown-error", the error message is logged to sentry.
 * @param cause
 * @param data
 * @returns
 */
export function createPlannerErrorResponse<C extends PlannerErrorCause>(
  cause: C,
  data: Extract<PlannerError, { cause: C }>["data"],
  error?: any,
): { ok: false; error: Extract<PlannerError, { cause: C }> } {
  if (cause === "unknown-error") {
    console.error("Unknown error occurred", { error });
    log
      .error(
        (data as Extract<PlannerError, { cause: "unknown-error" }>["data"])
          .message,
      )
      .cli();
  } else {
    log.warn(cause, data);
  }
  return {
    ok: false,
    error: {
      cause,
      data,
    } as Extract<PlannerError, { cause: C }>,
  };
}

export function cutUnavailabilitiesFromTimeFrame(
  timeFrame: AvailableTimeFrame,
  unavailabilities: TimeFrame[],
): AvailableTimeFrame[] {
  log.info(
    "Cutting unavailabilities from time frame",
    `Time frame: ${dayjs(timeFrame.start).format("DD.MM.YYYY HH:mm")} - ${dayjs(
      timeFrame.end,
    ).format("DD.MM.YYYY HH:mm")}`,
  );
  // Initialize an empty array to store the remaining available time frames
  const remainingTimeFrames: AvailableTimeFrame[] = [];

  // Initialize variables to keep track of the current start and end times
  let currentStart = timeFrame.start;
  const currentEnd = timeFrame.end;

  // Sort the unavailabilities array based on the start time
  const sortedUnavailabilities = unavailabilities.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  // Iterate through each unavailability
  for (const unavailability of sortedUnavailabilities) {
    // Check if the unavailability overlaps with the current time frame
    if (
      new Date(unavailability.start).getTime() <
        new Date(currentEnd).getTime() &&
      new Date(unavailability.end).getTime() > new Date(currentStart).getTime()
    ) {
      // If there's time before the unavailability, add it to the remaining time frames
      if (
        new Date(unavailability.start).getTime() >
        new Date(currentStart).getTime()
      ) {
        remainingTimeFrames.push({
          start: currentStart,
          end: unavailability.start,
          appointmentOptions: timeFrame.appointmentOptions,
        });
      }

      // Update the current start time to the end of the unavailability
      currentStart = unavailability.end;
    }
  }

  // If there's time remaining after the last unavailability, add it to the remaining time frames
  if (new Date(currentStart).getTime() < new Date(currentEnd).getTime()) {
    remainingTimeFrames.push({
      start: currentStart,
      end: currentEnd,
      appointmentOptions: timeFrame.appointmentOptions,
    });
  }

  return remainingTimeFrames;
}

export function removeTooShortTimeFrames(
  layer: LayerWithAvailableTimeFrames,
): PlannerFunctionResponse<LayerWithAvailableTimeFrames> {
  try {
    // remove all timeframes that are shorter than their duration
    return {
      ok: true,
      data: {
        layer: layer.layer,
        availableTimeFrames: layer.availableTimeFrames.filter(
          (timeFrame) =>
            dayjs(timeFrame.end).diff(dayjs(timeFrame.start), "minute") >=
            // this is the allowed duration for this time frame
            // so any time frame that is shorter than this duration
            // should be removed
            timeFrame.appointmentOptions.duration,
        ),
      },
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message: "error-removing-too-short-time-frames",
      },
      e,
    );
  }
}

export function getTotalAvailableTimeFrames(
  constraints: PlannerConstraints,
): PlannerFunctionResponse<AvailableTimeFrame[]> {
  try {
    const { dateRange, availableTimeSlots } = constraints;
    const availableTimeFrames: AvailableTimeFrame[] = [];

    log.info("Getting available time frames...");
    availableTimeSlots.forEach((slot) => {
      const { rrule, startTime, endTime } = slot;

      const parsedRRule = rrulestr(rrule.toString());

      const appointmentOptions =
        slot.mode === "use-custom-options" ? slot.options : constraints.options;

      const dates = parsedRRule.between(
        new Date(dateRange.from),
        dayjs(dateRange.to).add(1, "day").toDate(),
        true,
      );

      dates.forEach((date) => {
        const start = dayjs(date)
          .hour(startTime.hour)
          .minute(startTime.minute)
          .toDate();
        const end = dayjs(date)
          .hour(endTime.hour)
          .minute(endTime.minute)
          .toDate();

        availableTimeFrames.push({
          start,
          end,
          appointmentOptions,
        });
      });
    });

    if (
      isAvailableTimeFramesShorterThanHours(availableTimeFrames, constraints)
    ) {
      return createPlannerErrorResponse(
        "total-available-time-shorter-than-hours",
        {
          hoursDefinedByConstraints: constraints.quantity.value,
          totalAvailableTime: availableTimeFrames.reduce(
            (total, timeFrame) =>
              total + dayjs(timeFrame.end).diff(dayjs(timeFrame.start), "hour"),
            0,
          ),
        },
      );
    }
    return {
      ok: true,
      data: availableTimeFrames,
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message: "error-getting-available-time-frames",
      },
      e,
    );
  }
}

function isAvailableTimeFramesShorterThanHours(
  availableTimeFrames: AvailableTimeFrame[],
  constraints: PlannerConstraints,
): boolean {
  if (constraints.quantity.type !== "hours") return false;
  const totalAvailableTime = availableTimeFrames.reduce(
    (total, timeFrame) =>
      total + dayjs(timeFrame.end).diff(dayjs(timeFrame.start), "hour"),
    0,
  );

  return totalAvailableTime < constraints.quantity.value;
}

export function splitLayerTimeFramesByDuration(
  layerWithAvailableTimeFrames: LayerWithAvailableTimeFrames,
): PlannerFunctionResponse<LayerWithAvailableTimeFrames> {
  try {
    const timeFrames = layerWithAvailableTimeFrames.availableTimeFrames;
    const splitTimeFrames: AvailableTimeFrame[] = [];
    // Each time frame is passed through the splitTimeFrameByDuration function
    // which will break down the time frame into smaller time frames with the length of the required duration
    // This will leave us with a larger array of time frames that are all of the same length
    // and perfectly suited for planning appointments in them
    timeFrames.forEach((timeFrame) => {
      const splitTimeFrame = splitTimeFrameByDuration(timeFrame);
      // Add the newly created equal time frames to the splitTimeFrames array
      splitTimeFrames.push(...splitTimeFrame);
    });

    return {
      ok: true,
      data: {
        layer: layerWithAvailableTimeFrames.layer,
        availableTimeFrames: splitTimeFrames,
      },
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      { message: "error-splitting-time-frames-by-duration" },
      e,
    );
  }
}

function splitTimeFrameByDuration(
  timeFrame: AvailableTimeFrame,
): AvailableTimeFrame[] {
  const { start, end, appointmentOptions } = timeFrame;
  const { duration: allowedDuration } = appointmentOptions;

  const availableTimeFrames: AvailableTimeFrame[] = [];

  let currentStart = dayjs(start);
  const endTime = dayjs(end);

  while (currentStart.isBefore(endTime)) {
    const currentEnd = dayjs(currentStart).add(allowedDuration, "minute");

    if (currentEnd.isBefore(endTime) || currentEnd.isSame(endTime)) {
      availableTimeFrames.push({
        start: currentStart.toDate(),
        end: currentEnd.toDate(),
        appointmentOptions,
      });
    }

    currentStart = currentStart.add(20, "minute");
  }

  return availableTimeFrames;
}

export function getLayerWithAvailableTimeFrames(
  layer: PlannerLayerWithAvailableResources,
  availableTimeFrames: AvailableTimeFrame[],
): PlannerFunctionResponse<LayerWithAvailableTimeFrames> {
  try {
    const unavailabilities = layer.layer.unavailabilities || [];

    const remainingTimeFrames = availableTimeFrames.flatMap((timeFrame) =>
      cutUnavailabilitiesFromTimeFrame(timeFrame, unavailabilities),
    );

    return {
      ok: true,
      data: {
        layer: {
          ...layer,
          layer: {
            ...layer.layer,
            unavailabilities: [],
          },
        },
        availableTimeFrames: remainingTimeFrames,
      },
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message: "error-cutting-unavailabilities-from-time-frames",
      },
      e,
    );
  }
}

export function assignResourcesToTimeFrames(
  layerWithSplitTimeFrames: LayerWithAvailableTimeFrames,
): PlannerFunctionResponse<LayerWithAvailableTimeFramesAndAvailableResources> {
  try {
    const timeFramesWithAvailableResources: AvailableTimeFrameWithResources[] =
      [];
    // Iterate through each time frame
    layerWithSplitTimeFrames.availableTimeFrames.forEach((timeFrame) => {
      // Get the resources that are available during the time frame
      const resources = layerWithSplitTimeFrames.layer.resources.filter(
        (resource) =>
          !hasResourceUnavailabilityAtTimeFrame(resource, timeFrame),
      );

      const hasResources = resources.length > 0;
      const hasOrganizer = resources.some(
        (resource) => resource.type === "organizer",
      );

      // Add the resources to the time frame
      if (hasResources && hasOrganizer) {
        timeFramesWithAvailableResources.push({
          ...timeFrame,
          resources: resources.map(
            (resource) =>
              ({
                name: resource.name,
                id: resource.id,
                type: resource.type,
              }) as any,
          ),
        });
      }
    });

    return {
      ok: true,
      data: {
        layer: layerWithSplitTimeFrames.layer,
        availableTimeFramesWithResources: timeFramesWithAvailableResources,
      },
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message: "error-assigning-resources-to-time-frames",
      },
      e,
    );
  }
}

function hasResourceUnavailabilityAtTimeFrame(
  resource: Resource,
  timeFrame: TimeFrame,
): boolean {
  // If the resource has no unavailabilities, it is always available
  if (!resource.unavailabilities || resource.unavailabilities.length === 0) {
    return false;
  }

  // Iterate through each unavailability of the resource
  for (const unavailability of resource.unavailabilities) {
    // Case 1: Unavailability starts before the time frame and ends after the time frame start
    if (
      new Date(unavailability.start).getTime() <=
        new Date(timeFrame.start).getTime() &&
      new Date(unavailability.end).getTime() >
        new Date(timeFrame.start).getTime()
    ) {
      return true;
    }

    // Case 2: Unavailability starts before the time frame end and ends after the time frame
    if (
      new Date(unavailability.start).getTime() < timeFrame.end.getTime() &&
      new Date(unavailability.end).getTime() >= timeFrame.end.getTime()
    ) {
      return true;
    }

    // Case 3: Unavailability starts and ends within the time frame
    if (
      new Date(unavailability.start).getTime() >=
        new Date(timeFrame.start).getTime() &&
      new Date(unavailability.end).getTime() <= timeFrame.end.getTime()
    ) {
      return true;
    }

    // Case 4: Unavailability starts before the time frame and ends after the time frame
    if (
      new Date(unavailability.start).getTime() <=
        new Date(timeFrame.start).getTime() &&
      new Date(unavailability.end).getTime() >= timeFrame.end.getTime()
    ) {
      return true;
    }
  }

  // If no overlapping unavailability is found, the resource is available during the time frame
  return false;
}

export function planAppointmentsBasedOnConstraintsAndTimeFrames(
  layer: LayerWithAvailableTimeFramesAndAvailableResources,
  constraints: PlannerConstraints,
): PlannerFunctionResponse<ScheduleAppointment[]> {
  try {
    const quantityPlanningType = constraints.quantity.type;
    // How many units are left to plan - we will decrease this number as we plan appointments
    let leftToPlan = constraints.quantity.value;
    const maxAppointmentsPerDay = constraints.options.maxAppointmentsPerDay;
    const daysThatHaveAppointments: string[] = [];
    let availableTimeFramesWithResources =
      layer.availableTimeFramesWithResources.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    const plannedAppointments: ScheduleAppointment[] = [];

    while (leftToPlan > 0) {
      const appointment = matchAppointmentWithAvailableTimeFrame(
        layer.layer.layer,
        availableTimeFramesWithResources,
        leftToPlan,
        constraints,
      );

      if (!appointment.ok) {
        return {
          ok: true,
          data: plannedAppointments,
          error: appointment.error,
        };
      }

      const { data: appointmentData } = appointment;

      daysThatHaveAppointments.push(
        dayjs(appointmentData.dateTime).format("YYYY-MM-DD"),
      );

      if (
        daysThatHaveAppointments.filter(
          (day) => day === dayjs(appointmentData.dateTime).format("YYYY-MM-DD"),
        ).length >= maxAppointmentsPerDay
      ) {
        availableTimeFramesWithResources =
          availableTimeFramesWithResources.filter(
            (timeFrame) =>
              dayjs(timeFrame.start).format("YYYY-MM-DD") !==
              dayjs(appointmentData.dateTime).format("YYYY-MM-DD"),
          );
      } else {
        //LOGIC HERE
        if (
          daysThatHaveAppointments.filter(
            (day) =>
              day === dayjs(appointmentData.dateTime).format("YYYY-MM-DD"),
          ).length >= maxAppointmentsPerDay
        ) {
          availableTimeFramesWithResources =
            availableTimeFramesWithResources.filter(
              (timeFrame) =>
                dayjs(timeFrame.start).format("YYYY-MM-DD") !==
                dayjs(appointmentData.dateTime).format("YYYY-MM-DD"),
            );
        } else {
          // Remove the timeframes that overlap with the created appointment
          availableTimeFramesWithResources =
            availableTimeFramesWithResources.filter(
              (timeFrame) =>
                !(
                  dayjs(timeFrame.start).format("YYYY-MM-DD") ===
                    dayjs(appointmentData.dateTime).format("YYYY-MM-DD") &&
                  appointmentOverlapsWithTimeFrame(appointmentData, timeFrame)
                ),
            );
        }
      }

      plannedAppointments.push(appointmentData);

      if (quantityPlanningType === "appointments") {
        leftToPlan--;
      } else {
        leftToPlan -= appointmentData.duration / 60;
      }
    }

    return {
      ok: true,
      data: plannedAppointments,
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message:
          "error-planning-appointments-based-on-constraints-and-time-frames",
      },
      e,
    );
  }
}

// Helper function to check if an appointment overlaps with a timeframe
function appointmentOverlapsWithTimeFrame(
  appointment: ScheduleAppointment,
  timeFrame: AvailableTimeFrameWithResources,
): boolean {
  const appointmentStart = new Date(appointment.dateTime);
  const appointmentEnd = new Date(
    appointmentStart.getTime() + appointment.duration * 60000,
  );

  // Case 1: Appointment starts before the time frame and ends after the time frame start
  if (appointmentStart <= timeFrame.start && appointmentEnd > timeFrame.start) {
    return true;
  }

  // Case 2: Appointment starts before the time frame end and ends after the time frame
  if (appointmentStart < timeFrame.end && appointmentEnd >= timeFrame.end) {
    return true;
  }

  // Case 3: Appointment starts and ends within the time frame
  if (appointmentStart >= timeFrame.start && appointmentEnd <= timeFrame.end) {
    return true;
  }

  // Case 4: Appointment starts before the time frame and ends after the time frame
  if (appointmentStart <= timeFrame.start && appointmentEnd >= timeFrame.end) {
    return true;
  }

  // If no overlapping is found, the appointment does not overlap with the timeframe
  return false;
}

function matchAppointmentWithAvailableTimeFrame(
  layer: LayerUserHasAccessTo,
  availableTimeFramesWithResources: AvailableTimeFrameWithResources[],
  leftToPlan: number,
  constraints: PlannerConstraints,
): PlannerFunctionResponse<ScheduleAppointment> {
  try {
    let availableTimeFrameWithResourceToUse:
      | AvailableTimeFrameWithResources
      | undefined;

    // The timeframe needs to be online or have a room
    for (const timeFrame of availableTimeFramesWithResources) {
      const { resources } = timeFrame;

      // If the appointment is online, we can use it, since all
      // timeframes without an organizer, have been filtered
      // out in the assignResourcesToTimeFrames function
      if (timeFrame.appointmentOptions.type === "online") {
        availableTimeFrameWithResourceToUse = timeFrame;
        break;
      }

      const hasRoom = resources.some((resource) => resource.type === "room");
      if (hasRoom) {
        availableTimeFrameWithResourceToUse = timeFrame;
        break;
      }
    }

    // If not available, the planning will end here with a warning
    // that not all appointments could be planned
    if (!availableTimeFrameWithResourceToUse) {
      if (constraints.quantity.type === "appointments") {
        return createPlannerErrorResponse("appointments-left-over", {
          appointmentsLeftOver: leftToPlan,
        });
      }
      return createPlannerErrorResponse("hours-left-over", {
        hoursLeftOver: Math.round(leftToPlan * 10) / 10,
      });
    }

    const organizerUsers = availableTimeFrameWithResourceToUse.resources.filter(
      (resource) => resource.type === "organizer",
    );

    if (organizerUsers.length === 0 || !organizerUsers[0]) {
      return createPlannerErrorResponse("unknown-error", {
        message:
          "error-getting-organizer-for-appointment-in-match-making-process",
      });
    }

    const room = availableTimeFrameWithResourceToUse.resources.filter(
      (resource) => resource.type === "room",
    )[0];

    if (
      availableTimeFrameWithResourceToUse.appointmentOptions.type ===
        "offline" &&
      !room
    ) {
      return createPlannerErrorResponse("unknown-error", {
        message: "error-getting-room-for-appointment-in-match-making-process",
      });
    }

    const leftToPlanInMinutes = leftToPlan * 60;
    const isOnline =
      availableTimeFrameWithResourceToUse.appointmentOptions.type === "online";

    return {
      ok: true,
      data: {
        id: cuid(),
        title: "Auto Appointment",
        dateTime: availableTimeFrameWithResourceToUse.start,
        duration:
          constraints.quantity.type === "appointments"
            ? availableTimeFrameWithResourceToUse.appointmentOptions.duration
            : availableTimeFrameWithResourceToUse.appointmentOptions.duration <=
              leftToPlanInMinutes
            ? availableTimeFrameWithResourceToUse.appointmentOptions.duration
            : leftToPlanInMinutes,
        isOnline: isOnline,
        isHybrid: false,
        organizerUsers: [{ organizerId: organizerUsers[0]!.id }],
        organizerData: [
          {
            name: organizerUsers[0]!.name,
            selectedDataForDisplay: organizerUsers[0]!.name,
          },
        ],
        appointmentLayers: [{ layer: layer } as any],
        roomId: isOnline ? "" : room?.id || "",
        room: isOnline
          ? null
          : room
          ? ({ id: room.id, name: room.name } as any)
          : undefined,
        type: "draft",
      } as any,
    };
  } catch (e) {
    return createPlannerErrorResponse(
      "unknown-error",
      {
        message: "match-making-failed",
      },
      e,
    );
  }
}

export function updateLayerResourceAvailabilities(
  layers: PlannerLayerWithAvailableResources[],
  generatedAppointments: ScheduleAppointment[],
): PlannerLayerWithAvailableResources[] {
  return layers.map((layer) => {
    const updatedResources: Resource[] = layer.resources.map((resource) => {
      const resourceAppointments = generatedAppointments.filter(
        (appointment) =>
          appointment.organizerUsers.some(
            (user) => user.organizerId === resource.id,
          ) || appointment.roomId === resource.id,
      );

      const newUnavailabilities: TimeFrame[] = resourceAppointments.map(
        (appointment) => ({
          start: appointment.dateTime,
          end: new Date(
            appointment.dateTime.getTime() + appointment.duration * 60000,
          ),
        }),
      );

      return {
        ...resource,
        unavailabilities: [
          ...(resource.unavailabilities || []),
          ...newUnavailabilities,
        ],
      };
    });

    return {
      ...layer,
      resources: updatedResources,
    };
  });
}
