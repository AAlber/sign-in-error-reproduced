import { dequal } from "dequal";
import React, { useEffect, useRef } from "react";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useSchedule from "../../zustand";
import Appointment from "./appointment";
import AppointmentDraft from "./draft";
import DragOverlay from "./drag-overlay";
import useAppointmentList from "./use-appointment-list";

type Props = {
  appointments: ScheduleAppointment[];
  offset?: number;
  monitorMode?: boolean;
};

function AppointmentList({
  appointments,
  offset = 0,
  monitorMode = false,
}: Props) {
  const appointmentList = useAppointmentList(appointments);
  const dayColumnRef = useRef<HTMLLIElement>(null);
  const { setWeekDaysColumSize } = useSchedule();

  useEffect(() => {
    const handleResize = () => {
      if (dayColumnRef.current) {
        setWeekDaysColumSize(dayColumnRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {appointmentList.map((appointment) => {
        return appointment.type === "draft" ? (
          <AppointmentDraft
            appointment={appointment}
            monitorMode={monitorMode}
            offset={offset}
            key={appointment.id}
          />
        ) : (
          <Appointment
            appointment={appointment}
            key={appointment.id}
            monitorMode={monitorMode}
            offset={offset}
          />
        );
      })}
      <DragOverlay appointmentsList={appointmentList} />
    </>
  );
}

export default React.memo(AppointmentList, (prev, next) => {
  return dequal(prev.appointments, next.appointments);
});
