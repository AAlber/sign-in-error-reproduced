import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type {
  AvailableTimeFrame,
  PlannerLayerWithAvailableResources,
} from "@/src/types/planner/planner.types";
import type { PlannerConstraints } from "@/src/types/planner/planner-constraints.types";
import type { PlannerFunctionResponse } from "@/src/types/planner/planner-errors.types";
import {
  assignResourcesToTimeFrames,
  getLayerWithAvailableTimeFrames,
  getTotalAvailableTimeFrames,
  planAppointmentsBasedOnConstraintsAndTimeFrames,
  removeTooShortTimeFrames,
  splitLayerTimeFramesByDuration,
  updateLayerResourceAvailabilities,
} from "./server-planner-util-functions";

export function generateDraftAppointments(
  layers: PlannerLayerWithAvailableResources[],
  constraints: PlannerConstraints,
): PlannerFunctionResponse<ScheduleAppointment[]> {
  // Getting all possible time frames that could be used for appointments
  // These do not consider any unavailabilities, meaning they are just being
  // created by getting dates that fall within the constraints (e.g. date range, rrule, etc)
  const totalTimeFrames = getTotalAvailableTimeFrames(constraints);
  if (!totalTimeFrames.ok) return totalTimeFrames;

  const data: PlannerFunctionResponse<ScheduleAppointment[]>[] = [];
  let updatedLayers = layers;

  for (let i = 0; i < updatedLayers.length; i++) {
    const layer = updatedLayers[i];
    if (!layer) continue;
    const generatedAppointmentsForLayer = generateDraftAppointmentsForLayer(
      layer,
      constraints,
      totalTimeFrames.data,
    );
    data.push(generatedAppointmentsForLayer);

    if (generatedAppointmentsForLayer.ok) {
      updatedLayers = updateLayerResourceAvailabilities(
        updatedLayers,
        generatedAppointmentsForLayer.data,
      );
    }
  }

  if (data.some((d) => !d.ok)) {
    const d = data.find((d) => !d.ok);
    return d!.ok
      ? ({
          cause: "unknown-error",
          data: {
            message: "An unknown error occurred while generating appointments",
          },
        } as any)
      : d;
  } else if (data.some((d) => d.error !== undefined)) {
    return {
      ok: true,
      data: data.flatMap((d) => d.data) as any,
      error: data.find((d) => d.error !== undefined)!.error,
    };
  } else {
    return {
      ok: true,
      data: data.flatMap((d) => d.data) as any,
    };
  }
}

export function generateDraftAppointmentsForLayer(
  layer: PlannerLayerWithAvailableResources,
  constraints: PlannerConstraints,
  totalAvailableTimeFrames: AvailableTimeFrame[],
): PlannerFunctionResponse<ScheduleAppointment[]> {
  // Get all available time frames for the layer, meaning the time frames that are not blocked by unavailabilities
  // We take the total available time frames and cut out the unavailabilities
  const layerWithAllAvailabilities = getLayerWithAvailableTimeFrames(
    layer,
    totalAvailableTimeFrames,
  );
  if (!layerWithAllAvailabilities.ok) return layerWithAllAvailabilities;

  // Since all time frames have their respective appointment options assigned
  // we can already remove all time frames that are shorter than the duration that is required.
  // E.g. if there are time frames which only allow 40 min appointments,
  // remove all time frames from that group that are shorter than 40 min
  const layerWithAvailabilitiesWithSufficientTime = removeTooShortTimeFrames(
    layerWithAllAvailabilities.data,
  );
  if (!layerWithAvailabilitiesWithSufficientTime.ok)
    return layerWithAvailabilitiesWithSufficientTime;

  // At this point we now only have time frames that are equal or longer than their required duration
  // This step is to break down time frames into equal parts with the length of the required duration
  // Meaning if we have a time frame that is 2:20 hours long and we only allow 30 min appointments
  // we will break down this time frame into 4 time frames of 30 min each and remove the remaining 20 min.
  // This ensures all time frames are perfectly fitted for planning appointments in them.
  const layerWithSplitTimeFrames = splitLayerTimeFramesByDuration(
    layerWithAvailabilitiesWithSufficientTime.data,
  );
  if (!layerWithSplitTimeFrames.ok) return layerWithSplitTimeFrames;
  // console.log("layersplit", layerWithSplitTimeFrames);

  // Now that we have perfectly suited time frames for planning appointments in them
  // we need to assign the resources that are available during these time frames.
  // This allows us to later just loop over the time frames and assign appointments to them,
  // and check if there are leftover appointments at the end
  const layerWithTimeFramesThatHaveAvailableResources =
    assignResourcesToTimeFrames(layerWithSplitTimeFrames.data);
  if (!layerWithTimeFramesThatHaveAvailableResources.ok)
    return layerWithTimeFramesThatHaveAvailableResources;

  const appointments = planAppointmentsBasedOnConstraintsAndTimeFrames(
    layerWithTimeFramesThatHaveAvailableResources.data,
    constraints,
  );

  return appointments;
}
