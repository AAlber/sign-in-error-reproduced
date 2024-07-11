import React, { useEffect, useRef } from "react";
import CalendarWeekView from "@/src/components/schedule/appointment-display/calendar/week-view";
import useSchedule from "@/src/components/schedule/zustand";
import { useUserOverview } from "../zustand";

export default function Calendar() {
  const container = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);

  const userId = useUserOverview((state) => state.user?.id) ?? "";
  const open = useUserOverview((state) => state.open);
  const fullScreenView = useSchedule((state) => state.fullScreenView);

  useEffect(() => {
    useSchedule.getState().resetState();
  }, [open]);

  if (fullScreenView !== "week") return null;
  return (
    <div className="h-[calc(100vh-56px-90px-1rem)] overflow-y-hidden rounded-md border border-border">
      <CalendarWeekView
        ref={containerNav}
        appointmentsOfUserId={userId}
        containerRef={container}
        containerOffsetRef={containerOffset}
        // 150px (distance from top of screen to bottom of description) + DetailDisplay min-h-33px === 183px
        appointmentsDisplayContainerClassName="h-full max-h-[calc(100vh-183px)] overflow-y-scroll"
      />
    </div>
  );
}
