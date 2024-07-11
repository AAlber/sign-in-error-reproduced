import type { RefObject } from "react";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";
import TimeDisplay from "../../time-display";
import useSchedule from "../../zustand";
import AppointmentDisplay from "../index";

type AppointmentDisplayContainerProps = {
  containerRef: RefObject<HTMLDivElement>;
  containerOffsetRef: RefObject<HTMLDivElement>;
  weekView: boolean;
  draggingDisabled: boolean;
  appointmentsOfUserId: string;
};

export const AppointmentDisplayContainer = ({
  containerRef,
  containerOffsetRef,
  weekView,
  draggingDisabled,
  appointmentsOfUserId,
}: AppointmentDisplayContainerProps) => {
  const [loading, fullScreenView] = useSchedule((state) => [
    state.loading,
    state.fullScreenView,
  ]);

  return (
    <div className="isolate flex flex-auto overflow-hidden">
      <div
        ref={containerRef}
        className={classNames("flex flex-auto flex-col", "overflow-auto")}
      >
        <div className="flex w-full flex-auto">
          {loading && <LoadingSpinner />}
          <div className="relative w-14 flex-none" />
          <div
            className={classNames(
              loading && "pointer-events-none opacity-50",
              "relative grid flex-auto grid-cols-1 grid-rows-1",
            )}
          >
            <TimeDisplay containerOffset={containerOffsetRef} />
            <AppointmentDisplay
              weekView={weekView}
              draggingDisabled={draggingDisabled}
              appointmentsOfUserId={appointmentsOfUserId}
              fullScreenView={fullScreenView}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function LoadingSpinner() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <Spinner size="w-8 h-8" />
    </div>
  );
}
