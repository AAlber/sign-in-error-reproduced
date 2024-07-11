import { isSameDay } from "date-fns";
import { dequal } from "dequal";
import React from "react";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import AppointmentList from "./appointment-list";
import { MIN_GRID_SPAN } from "./config";

type Props = {
  appointments: ScheduleAppointment[];
  selectedWeek: Date[];
  isDragValid: boolean;
};

/**
 * Renders all `appointments[]` for the `selectedWeek`
 */
const AppointmentListWeekly = ({ appointments, selectedWeek }: Props) => {
  if (!appointments || appointments.length === 0) return null;
  return (
    <>
      {selectedWeek.map((day, index) => (
        <AppointmentList
          key={day.toISOString()}
          appointments={appointments.filter((appointment) =>
            isSameDay(day, new Date(appointment.dateTime)),
          )}
          offset={index * MIN_GRID_SPAN}
        />
      ))}
    </>
  );
};

export default React.memo(AppointmentListWeekly, (prev, next) => {
  const appointmentsEqual = dequal(prev.appointments, next.appointments);
  const selectedWeekEqual = dequal(prev.selectedWeek, next.selectedWeek);
  return appointmentsEqual && selectedWeekEqual;
});
