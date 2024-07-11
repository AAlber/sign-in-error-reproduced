import { generateTimeOptions } from "@/src/client-functions/client-datetime-picker";
import usePlanner from "@/src/components/planner/zustand";
import TimePickerTrigger from "@/src/components/reusable/date-time-picker/time-picker/time-trigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/reusable/shadcn-ui/select";

export const SelectTimeArea = ({
  index,
  onValueChange,
  triggerValue,
}: {
  index: number;
  onValueChange: (value: string) => void;
  triggerValue: string;
}) => {
  const { constraints } = usePlanner();
  const timeOptions = generateTimeOptions(30);

  return (
    <Select
      value={`${constraints.availableTimeSlots[index]?.startTime.hour}:${constraints.availableTimeSlots[index]?.startTime.minute}`}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="h-auto border-0 p-0" hideIcon>
        <TimePickerTrigger value={triggerValue} />
      </SelectTrigger>
      <SelectContent className="max-h-[240px] overflow-scroll">
        {timeOptions.map((timeOption) => (
          <SelectItem key={timeOption} value={timeOption}>
            {timeOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
