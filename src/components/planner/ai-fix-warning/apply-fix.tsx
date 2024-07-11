import { rrulestr } from "rrule";
import { toast } from "@/src/components/reusable/toaster/toast";
import { log } from "@/src/utils/logger/logger";

export const applyFix = (option, setConstraints, constraints) => {
  const parsedData = option.updatedConstraint;
  const updatedDataForRRule = parsedData.availableTimeSlots
    ? {
        ...constraints,
        ...parsedData,
        availableTimeSlots: parsedData.availableTimeSlots.map((slot) => ({
          ...slot,
          rrule: rrulestr(slot.rrule),
        })),
      }
    : {
        ...constraints,
        ...parsedData,
      };

  try {
    setConstraints(updatedDataForRRule);
  } catch (error) {
    log.warn("Failed to update constraints", error);
    toast.error("planner.auto_fix_corrupt_suggestion", {});
  }
};
