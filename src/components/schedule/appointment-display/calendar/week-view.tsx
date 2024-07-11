import type { RefObject } from "react";
import React from "react";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import DetailedDayDisplay from "../../navigation/detailed";
import { AppointmentDisplayContainer } from "./appointments-display-container";

type Props = {
  appointmentsOfUserId: string;
  containerRef: RefObject<HTMLDivElement>;
  containerOffsetRef: RefObject<HTMLDivElement>;
  appointmentsDisplayContainerClassName?: string;
};

const CalendarWeekView = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      appointmentsOfUserId,
      appointmentsDisplayContainerClassName,
      containerRef,
      containerOffsetRef,
    },
    ref,
  ) => {
    const userId = useUser((state) => state.user.id);

    return (
      <>
        <div
          ref={ref}
          // min-h value is important! here so we can correctly compute the boundingRect of the calendar container
          className="relative grid min-h-[33px] flex-none grid-cols-7 rounded-t-md border-b border-border bg-background pl-14 text-xs text-muted-contrast"
        >
          <DetailedDayDisplay useWeekState />
        </div>
        <div
          className={classNames(
            appointmentsDisplayContainerClassName ??
              "flex h-full w-full flex-col bg-foreground",
          )}
        >
          <AppointmentDisplayContainer
            appointmentsOfUserId={appointmentsOfUserId}
            draggingDisabled={userId !== appointmentsOfUserId}
            containerRef={containerRef}
            containerOffsetRef={containerOffsetRef}
            weekView
          />
        </div>
      </>
    );
  },
);

CalendarWeekView.displayName = "CalendarWeekView";
export default CalendarWeekView;
