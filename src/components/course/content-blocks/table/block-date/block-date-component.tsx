import dayjs from "dayjs";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

type Props = {
  addDateTitle: string;
  date: Date | null;
  onDateChange: (date: Date) => void;
  onRemoveButtonClick: () => void;
};

export default function BlockDate({
  addDateTitle,
  date,
  onDateChange,
  onRemoveButtonClick,
}: Props) {
  const [date_, setDate] = useState(date);

  const onChange = (date: Date) => {
    onDateChange(date);
  };

  const clearDate = () => {
    onRemoveButtonClick();
    setDate(null);
  };

  return (
    <DatePicker date={date_ ?? new Date()} showTime={false} onChange={onChange}>
      {date_ ? (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="small" className="-ml-1 px-2">
            {dayjs(date_).format("DD. MMM YYYY")}
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            className="font-normal text-muted-contrast"
            onClick={clearDate}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between gap-2 p-1 font-normal text-muted-contrast hover:!bg-transparent"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span>{addDateTitle}</span>
        </Button>
      )}
    </DatePicker>
  );
}
