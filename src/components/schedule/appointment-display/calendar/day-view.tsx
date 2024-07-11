import dayjs from "dayjs";
import type { RefObject } from "react";
import React from "react";
import { selectCurrentWeek } from "@/src/client-functions/client-schedule";
import { StandaloneCalendar } from "@/src/components/reusable/date-time-picker/date-picker";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import useSchedule from "../../zustand";
import { SpecificDayAppointmentsList } from "../specific-day-appointments-list";
import { AppointmentDisplayContainer } from "./appointments-display-container";

type Props = {
  appointmentsOfUserId: string;
  containerRef: RefObject<HTMLDivElement>;
  containerOffsetRef: RefObject<HTMLDivElement>;
};

const CalendarDayView = React.forwardRef<HTMLDivElement, Props>(
  ({ appointmentsOfUserId, containerRef, containerOffsetRef }, ref) => {
    const [selectedDay, setSelectedDay] = useSchedule((state) => [
      state.selectedDay,
      state.setSelectedDay,
    ]);

    return (
      <div className="flex h-full">
        <div className="flex size-full flex-col">
          <div className="border-b border-border p-3" ref={ref}>
            <p className="text-xl font-semibold">
              {dayjs(selectedDay).format("MMMM DD, YYYY")}
            </p>
            <p className="text-lg font-light">
              {dayjs(selectedDay).format("dddd")}
            </p>
          </div>
          <div className="flex flex-col overflow-auto bg-foreground">
            <AppointmentDisplayContainer
              appointmentsOfUserId={appointmentsOfUserId}
              draggingDisabled={false}
              containerRef={containerRef}
              containerOffsetRef={containerOffsetRef}
              weekView={false}
            />
          </div>
        </div>
        <div className="flex w-[370px] flex-col items-center overflow-y-auto border-l border-border bg-foreground">
          <StandaloneCalendar
            date={selectedDay}
            onChangeDate={undefined}
            onChange={(date) => {
              if (!date) return setSelectedDay(selectedDay);
              setSelectedDay(date);
              selectCurrentWeek(date);
            }}
            resetDateButton={
              // verify if the date is different from today
              dayjs(selectedDay).format("YYYY-MM-DD") !==
              dayjs().format("YYYY-MM-DD")
            }
          />
          <Separator />
          <SpecificDayAppointmentsList />
        </div>
      </div>
    );
  },
);

CalendarDayView.displayName = "CalendarDayView";
export default CalendarDayView;
