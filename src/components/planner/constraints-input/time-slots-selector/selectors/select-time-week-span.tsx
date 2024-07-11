import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import usePlanner from "../../../zustand";

const weeksOfMonth = [
  "every_first_week",
  "every_second_week",
  "every_third_week",
  "every_fourth_week",
];

export const SelectTimeWeekSpan = ({
  index,
  selectedWeekOfMonth,
  setSelectedWeekOfMonth,
  selectedDays,
}) => {
  const { t } = useTranslation("page");
  const { constraints, updateTimeSlot } = usePlanner();

  const handleWeekOfMonthChange = (value) => {
    setSelectedWeekOfMonth(parseInt(value));

    updateTimeSlot(index, {
      ...constraints.availableTimeSlots[index]!,
      rrule: new RRule({
        ...constraints.availableTimeSlots[index]!.rrule.options,
        byweekday: selectedDays,
        bysetpos: selectedWeekOfMonth + 1,
      }),
    });
  };

  return (
    <Select
      value={selectedWeekOfMonth.toString()}
      onValueChange={handleWeekOfMonthChange}
    >
      <SelectTrigger className="w-full rounded-l-none focus:ring-0">
        <SelectValue placeholder="Select week of month" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {weeksOfMonth.map((week, index) => (
            <SelectItem key={index} value={index.toString()}>
              {t(week)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
