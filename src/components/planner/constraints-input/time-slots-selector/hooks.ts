import { useEffect, useState } from "react";
import type { Weekday } from "rrule";
import { RRule } from "rrule";
import usePlanner from "../../zustand";

const weekdays = [
  RRule.MO,
  RRule.TU,
  RRule.WE,
  RRule.TH,
  RRule.FR,
  RRule.SA,
  RRule.SU,
];

export function useAvailableTimeSlotSettings(index) {
  const { constraints } = usePlanner();
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
  const [selectedWeekOfMonth, setSelectedWeekOfMonth] = useState(0);

  useEffect(() => {
    if (constraints.availableTimeSlots[index]?.rrule.options.byweekday) {
      setSelectedDays(
        weekdays.filter((weekday) =>
          constraints.availableTimeSlots[
            index
          ]!.rrule.options.byweekday.includes(weekdays.indexOf(weekday)),
        ),
      );
    }
  }, [constraints.availableTimeSlots, index]);

  return {
    selectedDays,
    setSelectedDays,
    selectedWeekOfMonth,
    setSelectedWeekOfMonth,
  };
}
