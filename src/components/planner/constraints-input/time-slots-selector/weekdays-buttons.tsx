import type { Weekday } from "rrule";
import { RRule } from "rrule";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
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
const weekdaysText = ["M", "T", "W", "T", "F", "S", "S"];

export const TimeSlotWeekdaysButtons = ({
  index,
  selectedDays,
  setSelectedDays,
}: {
  index: number;
  selectedDays: Weekday[];
  setSelectedDays: (days: Weekday[]) => void;
}) => {
  const { constraints, updateTimeSlot } = usePlanner();

  const handleDayClick = (day) => {
    let newSelectedDays;
    if (selectedDays.includes(day)) {
      newSelectedDays = selectedDays.filter((d) => d !== day);
    } else {
      newSelectedDays = [...selectedDays, day];
    }

    setSelectedDays(newSelectedDays);

    updateTimeSlot(index, {
      ...constraints.availableTimeSlots[index]!,
      rrule: new RRule({
        ...constraints.availableTimeSlots[index]!.rrule.options,
        byweekday: newSelectedDays,
      }),
    });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-contrast">
      <div className="flex w-full items-center justify-between gap-2">
        {weekdays.map((weekday, index) => (
          <Button
            variant={selectedDays.includes(weekday) ? "cta" : "default"}
            key={index}
            onClick={() => handleDayClick(weekday)}
            className="w-full"
          >
            {weekdaysText[index]}
          </Button>
        ))}
      </div>
    </div>
  );
};
