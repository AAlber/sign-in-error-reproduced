import React, { useEffect, useRef, useState } from "react";
import {
  generateTimeOptions,
  useHandleStartTime,
} from "@/src/client-functions/client-datetime-picker";
import { sleep } from "@/src/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../shadcn-ui/select";
import TimePickerTrigger from "./time-trigger";

interface TimePickerProps {
  onSelect: (value: Date) => void;
  dateTime: Date;
  children?: React.ReactNode;
}

const TimePicker: React.FC<TimePickerProps> = ({
  onSelect,
  dateTime,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const { startTime, setStartTime } = useHandleStartTime(dateTime);
  const selectContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function init() {
      /**
       * intentionally deferring the render of `timeOptions` here as this can be slow
       * when mounting multiple TimePicker components due to synchronous compute of time intervals
       */
      return new Promise<string[]>(async (resolve) => {
        await sleep(400); // experimental value must be greater than a transition's duration
        resolve(generateTimeOptions());
      });
    }

    init().then(setTimeOptions);
  }, []);

  useEffect(() => {
    if (selectContentRef.current) {
      const localTimeElement = selectContentRef.current.querySelector(
        `[value="${startTime}"]`,
      ) as HTMLOptionElement | null;
      if (localTimeElement) {
        localTimeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [open, startTime]);

  const handleTimeChange = (value: string) => {
    const newDate = new Date(dateTime);
    newDate.setHours(parseInt(value.split(":")[0]!));
    newDate.setMinutes(parseInt(value.split(":")[1]!));

    setStartTime(value);
    onSelect?.(newDate);
  };

  return (
    <Select
      open={open}
      onOpenChange={(value) => setOpen(value)}
      value={startTime}
      onValueChange={handleTimeChange}
      disabled={!timeOptions.length}
    >
      {children ? (
        <SelectTrigger className="size-auto border-0 p-0" hideIcon>
          {children}
        </SelectTrigger>
      ) : (
        <TimePickerTrigger value={startTime || ""} />
      )}
      <SelectContent
        className="max-h-[240px] overflow-scroll"
        ref={selectContentRef}
      >
        {timeOptions.map((timeOption) => (
          <SelectItem key={timeOption} value={timeOption}>
            {timeOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePicker;
