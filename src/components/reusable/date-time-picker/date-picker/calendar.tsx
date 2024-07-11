"use client";

import { ChevronLeft, ChevronRight, Undo2 } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import cn from "@/src/client-functions/client-utils";
import { Button } from "../../shadcn-ui/button";
import WithToolTip from "../../with-tooltip";
import { buttonVariants } from "./calendar-button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  resetDateButton?: boolean;
  onResetDate?: () => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  resetDateButton,
  onResetDate,
  ...props
}: CalendarProps) {
  return (
    <div className="relative">
      <DayPicker
        weekStartsOn={1}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-contrast rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md",
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_start: "day-range-start",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-contrast hover:bg-primary hover:text-primary-contrast focus:bg-primary focus:text-primary-contrast",
          day_today: "bg-accent text-accent-contrast",
          day_outside: "text-muted-contrast opacity-50",
          day_disabled: "text-muted-contrast opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-contrast",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-4 w-4 text-contrast" />
          ),

          IconRight: ({ ...props }) => (
            <ChevronRight className="h-4 w-4 text-contrast" />
          ),
        }}
        {...props}
      />
      {resetDateButton && (
        <Button
          onClick={onResetDate}
          size={"icon"}
          className="absolute left-12 top-3 h-7 w-7"
        >
          <WithToolTip
            text="back_to_today"
            className="flex h-full w-full items-center justify-center"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </WithToolTip>
        </Button>
      )}
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
