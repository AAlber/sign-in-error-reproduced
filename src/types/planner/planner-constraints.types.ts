import dayjs from "dayjs";
import { RRule } from "rrule";

// Defaults

export const defaultOptions: Options = {
  duration: 60,
  maxAppointmentsPerDay: 1,
  type: "online",
};

export const defaultConstraints: PlannerConstraints = {
  quantity: { type: "appointments", value: 5 },
  dateRange: {
    from: new Date(),
    to: dayjs().add(1, "month").toDate(),
  },
  allowSwitchingTypesOnRoomUnavailability: false,
  options: defaultOptions,
  availableTimeSlots: [
    {
      rrule: new RRule({
        freq: RRule.WEEKLY,
        byweekday: [],
      }),
      startTime: { hour: 9, minute: 0 },
      endTime: { hour: 17, minute: 0 },
      mode: "use-default-options",
    },
  ],
};

// Types

export type PlannerConstraints = {
  quantity: Quantity;
  dateRange: {
    from: Date;
    to: Date;
  };
  allowSwitchingTypesOnRoomUnavailability: boolean;
  options: Options;
  availableTimeSlots: AvailableTimeSlot[];
};

type Quantity = {
  type: "appointments" | "hours";
  value: number;
};

type AvailableTimeSlotBase = {
  rrule: RRule;
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
};

export type AvailableTimeSlotWithCustomOptions = AvailableTimeSlotBase & {
  mode: "use-custom-options";
  options: Options;
};

type AvailableTimeSlotWithoutCustomOptions = AvailableTimeSlotBase & {
  mode: "use-default-options";
};

export type AvailableTimeSlot =
  | AvailableTimeSlotWithCustomOptions
  | AvailableTimeSlotWithoutCustomOptions;

export type Options = {
  duration: number;
  type: "online" | "offline";
  maxAppointmentsPerDay: number;
};
