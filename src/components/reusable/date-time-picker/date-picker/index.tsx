import { getMonth } from "date-fns";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn-ui/popover";
import TimePicker from "../time-picker";
import { Calendar } from "./calendar";

type DatePickerProps = {
  date?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  position?: "top" | "bottom";
  showTime?: boolean;
  children?: React.ReactNode;
  resetDateButton?: boolean;
  responsiveFormat?: boolean;
  smallFormat?: boolean;
};

export const StandaloneCalendar = ({
  date,
  onChange,
  onChangeDate,
  resetDateButton,
}) => {
  const currentDate = date ? new Date(date) : new Date();
  const defaultMonth = new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
  );
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  useEffect(() => {
    setCurrentMonth(currentDate);
  }, [getMonth(currentDate)]);

  return (
    <Calendar
      mode="single"
      selected={currentDate}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      onSelect={(date) => {
        if (!date) return;
        onChange && onChange(date);
        onChangeDate && onChangeDate(date);
      }}
      showOutsideDays={true}
      resetDateButton={resetDateButton}
      onResetDate={() => {
        onChange && onChange(new Date());
        onChangeDate && onChangeDate(new Date());
      }}
    />
  );
};

export function DatePicker(props: DatePickerProps) {
  const [date, setDate]: any = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const { t } = useTranslation("page");

  useEffect(() => {
    if (props.date) {
      setDate(props.date);
    } else {
      setDate(null);
    }
  }, [props.date]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {props.children ? (
          <div>{props.children}</div>
        ) : (
          <button
            className={classNames(
              "group flex h-8 w-full items-center gap-x-2 rounded-md border border-border px-2 py-2 transition-all duration-200  ease-in-out hover:bg-accent",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-contrast" />
            {!date ? (
              <span className="text-sm text-muted-contrast ">
                {t(props.placeholder!)}
              </span>
            ) : (
              <>
                <span
                  className={classNames(
                    "text-sm text-contrast",
                    props.smallFormat && "hidden",
                    props.responsiveFormat ? "max-xl:hidden" : "",
                  )}
                >
                  {!props.showTime
                    ? dayjs(date).format("DD MMM YYYY")
                    : dayjs(date).format("DD MMM YYYY, HH:mm")}
                </span>
                {(props.responsiveFormat || props.smallFormat) && (
                  <span
                    className={classNames(
                      "block text-sm text-contrast",
                      props.smallFormat ? "block" : "xl:hidden",
                    )}
                  >
                    {!props.showTime
                      ? dayjs(date).format("DD.MM.YY")
                      : dayjs(date).format("DD.MM.YY, HH:mm")}
                  </span>
                )}
              </>
            )}
            <div className="ml-auto">
              <ChevronDown className="h-4 w-4 text-muted-contrast" />
            </div>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className=" w-auto  p-0 !shadow-none">
        <div className="flex">
          <StandaloneCalendar
            onChange={props.onChange}
            onChangeDate={setDate}
            date={date}
            resetDateButton={props.resetDateButton}
          />
          {props.showTime && (
            <div className="border-l border-border p-3 ">
              <TimePicker onSelect={props.onChange} dateTime={date} />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
