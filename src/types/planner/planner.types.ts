import type { InstitutionRoom } from "@prisma/client";
import { z } from "zod";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";
import type { Options, PlannerConstraints } from "./planner-constraints.types";

type Fallback = "swap-to-next-available" | "switch-appointment-type";

type ResourceBase = {
  id: string;
  loadingUnavailabilities?: boolean;
  unavailabilities?: TimeFrame[];
};

type ResourceWithNoFallback = ResourceBase & {
  canFallback: false;
};

type ResourceWithFallback = ResourceBase & {
  canFallback: true;
  fallbackOptions: Fallback[];
};

export type LayerResource = { type: "layer" } & ResourceWithNoFallback &
  LayerUserHasAccessTo;
export type OrganizerResource = { type: "organizer" } & ResourceWithFallback &
  SimpleUser;
export type RoomResource = { type: "room" } & ResourceWithFallback &
  InstitutionRoom;

export type Resource = OrganizerResource | RoomResource | LayerResource;

export type PlannerLayerWithAvailableResources = {
  layer: LayerResource;
  resources: Resource[];
};

export type PlannerData = {
  layers: PlannerLayerWithAvailableResources[];
  constraints: PlannerConstraints;
};

export type RequestUnavailablities = {
  id: string;
  type: "organizer" | "room" | "layer";
};

export type RequestUnavailablitiesResponse = {
  id: string;
  unavailabilities: TimeFrame[];
};

export type TimeFrame = {
  start: Date;
  end: Date;
};

export type AvailableTimeFrame = TimeFrame & {
  appointmentOptions: Options;
};

export type AvailableTimeFrameWithResources = AvailableTimeFrame & {
  resources: Resource[];
};

export type LayerWithAvailableTimeFrames = {
  layer: PlannerLayerWithAvailableResources;
  availableTimeFrames: AvailableTimeFrame[];
};

export type LayerWithAvailableTimeFramesAndAvailableResources = {
  layer: PlannerLayerWithAvailableResources;
  availableTimeFramesWithResources: AvailableTimeFrameWithResources[];
};

// Define the partial constraints schema
const partialPlannerConstraintsSchema = z.object({
  quantity: z
    .object({
      type: z.union([z.literal("appointments"), z.literal("hours")]),
      value: z.number(),
    })
    .optional(),
  dateRange: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),
  allowSwitchingTypesOnRoomUnavailability: z.boolean().optional(),
  options: z
    .object({
      duration: z.number(),
      type: z.union([z.literal("online"), z.literal("offline")]),
      maxAppointmentsPerDay: z.number(),
    })
    .optional(),
  availableTimeSlots: z
    .array(
      z.union([
        z.object({
          rrule: z.string(),
          startTime: z.object({
            hour: z.number(),
            minute: z.number(),
          }),
          endTime: z.object({
            hour: z.number(),
            minute: z.number(),
          }),
          mode: z.literal("use-custom-options"),
          options: z.object({
            duration: z.number(),
            type: z.union([z.literal("online"), z.literal("offline")]),
            maxAppointmentsPerDay: z.number(),
          }),
        }),
        z.object({
          rrule: z.string(),
          startTime: z.object({
            hour: z.number(),
            minute: z.number(),
          }),
          endTime: z.object({
            hour: z.number(),
            minute: z.number(),
          }),
          mode: z.literal("use-default-options"),
        }),
      ]),
    )
    .optional(),
});

// Define the options schema
export const plannerFixOptions = z.object({
  problemExplanation: z.string(),
  options: z
    .array(
      z.object({
        name: z.string().max(20),
        updatedConstraint: partialPlannerConstraintsSchema,
      }),
    )
    .min(1)
    .max(3),
});

export const plannerConstraintsSchema = z.object({
  quantity: z.object({
    type: z.union([z.literal("appointments"), z.literal("hours")]),
    value: z.number(),
  }),
  dateRange: z.object({
    from: z.string(),
    to: z.string(),
  }),
  allowSwitchingTypesOnRoomUnavailability: z.boolean(),
  options: z.object({
    duration: z.number(),
    type: z.union([z.literal("online"), z.literal("offline")]),
    maxAppointmentsPerDay: z.number(),
  }),
  availableTimeSlots: z.array(
    z.union([
      z.object({
        rrule: z.string(),
        startTime: z.object({
          hour: z.number(),
          minute: z.number(),
        }),
        endTime: z.object({
          hour: z.number(),
          minute: z.number(),
        }),
        mode: z.literal("use-custom-options"),
        options: z.object({
          duration: z.number(),
          type: z.union([z.literal("online"), z.literal("offline")]),
          maxAppointmentsPerDay: z.number(),
        }),
      }),
      z.object({
        rrule: z.string(),
        startTime: z.object({
          hour: z.number(),
          minute: z.number(),
        }),
        endTime: z.object({
          hour: z.number(),
          minute: z.number(),
        }),
        mode: z.literal("use-default-options"),
      }),
    ]),
  ),
});
