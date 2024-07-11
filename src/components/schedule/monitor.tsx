import { useRef } from "react";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "../spinner";
import AppointmentMonitorDisplay from "./appointment-display/monitor-display";
import MonitorPageNavigator from "./appointment-display/monitor-page-navigator";
import { useScheduleScrollToCurrentTime } from "./hooks";
import { MonitorFullscreenButton } from "./monitor-fullscreen-button";
import MonitorNavigation from "./navigation/navigation-monitor";
import TimeDisplay from "./time-display";
import useSchedule from "./zustand";

export default function ScheduleMonitor() {
  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const { loading, refresh, fullScreen } = useSchedule();

  useScheduleScrollToCurrentTime(container, containerNav, containerOffset, [
    refresh,
  ]);

  return (
    <div
      className={classNames(
        "flex h-full flex-col",
        fullScreen && "fixed inset-0 z-50 bg-background",
      )}
    >
      {fullScreen && (
        <div className="absolute right-4 top-1.5 z-50">
          <MonitorFullscreenButton />
        </div>
      )}
      <div className="isolate flex flex-auto overflow-hidden">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <MonitorNavigation containerNav={containerNav} />
          <div className="flex w-full flex-auto">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                {" "}
                <Spinner size="w-8 h-8" />{" "}
              </div>
            )}
            <div className="relative w-14 flex-none" />
            <MonitorPageNavigator />
            <div
              className={classNames(
                loading && "pointer-events-none opacity-50",
                "relative grid flex-auto grid-cols-1 grid-rows-1",
              )}
            >
              <TimeDisplay containerOffset={containerOffset} />
              <AppointmentMonitorDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
