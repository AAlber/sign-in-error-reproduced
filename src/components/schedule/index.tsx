import { useEffect, useRef, useState } from "react";
import { hasRolesInInstitution } from "@/src/client-functions/client-user-management";
import useUser from "@/src/zustand/user";
import { Planner } from "../planner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../reusable/shadcn-ui/resizable";
import CalendarDayView from "./appointment-display/calendar/day-view";
import CalendarWeekView from "./appointment-display/calendar/week-view";
import {
  useScheduleScrollToCurrentTime,
  useScheduleScrollToExactTime,
} from "./hooks";
import ScheduleMonitor from "./monitor";
import useSchedule from "./zustand";
import useScheduleFilter from "./zustand-filter";

export type ScheduleProps = {
  scheduleOfUserId?: string;
  filteredLayerIds?: string[];
};

export default function Schedule({ scheduleOfUserId }: ScheduleProps) {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);
  const userId = useUser((state) => state.user.id);

  const [fullScreenView, loading, selectedDay, plannerOpen, setCanCreate] =
    useSchedule((state) => [
      state.fullScreenView,
      state.loading,
      state.selectedDay,
      state.plannerOpen,
      state.setCanCreate,
    ]);

  const [firstLoad, setFirstLoad] = useState(true);

  useScheduleScrollToCurrentTime(container, containerNav, containerOffset, [
    selectedDay,
  ]);

  useScheduleScrollToExactTime(
    container,
    containerNav,
    containerOffset,
    selectedDay,
  );

  const { setFilteredLayers, filteredLayers } = useScheduleFilter();

  useEffect(() => {
    if (firstLoad) {
      setFilteredLayers(filteredLayers);
      setFirstLoad(false);
    }
  }, [filteredLayers, loading]);

  useEffect(() => {
    if (scheduleOfUserId) {
      setCanCreate(false);
      return;
    }

    hasRolesInInstitution({
      roles: ["admin", "moderator", "educator"],
    }).then((canCreate) => {
      setCanCreate(canCreate);
    });
  }, [scheduleOfUserId]);

  return (
    <>
      {fullScreenView === "monitor" ? (
        <ScheduleMonitor />
      ) : (
        <>
          {fullScreenView === "week" && (
            <ResizablePanelGroup
              direction="horizontal"
              className="flex size-full"
            >
              <ResizablePanel className="flex size-full flex-col">
                <CalendarWeekView
                  appointmentsOfUserId={userId}
                  containerRef={container}
                  containerOffsetRef={containerOffset}
                  ref={containerNav}
                />
              </ResizablePanel>
              {plannerOpen && (
                <>
                  <ResizableHandle withHandle className={"flex"} />
                  <Planner />
                </>
              )}
            </ResizablePanelGroup>
          )}

          {fullScreenView === "day" && (
            <CalendarDayView
              appointmentsOfUserId={userId}
              containerOffsetRef={containerOffset}
              containerRef={container}
              ref={containerNav}
            />
          )}
        </>
      )}
    </>
  );
}
