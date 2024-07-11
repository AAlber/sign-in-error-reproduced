import { dequal } from "dequal";
import React from "react";
import { getGridStyle } from "@/src/client-functions/client-schedule";
import type { AppointmentWithRowData } from "@/src/components/schedule/zustand";
import { DraggableItem } from "../draggable-item";
import AppointmentContent from "./content";

export type Props = {
  appointment: AppointmentWithRowData;
  offset: number;
  monitorMode: boolean;
};

function Appointment({
  appointment,
  monitorMode,
  offset,
}: React.PropsWithChildren<Props>) {
  return (
    <DraggableItem
      id={appointment.id}
      style={getGridStyle(appointment, offset)}
      metadata={{
        appointmentType: "regular",
        originalDateTime: appointment.dateTime,
        originalDuration: appointment.duration,
      }}
    >
      <AppointmentContent
        appointment={appointment}
        monitorMode={monitorMode}
        offset={offset}
      />
    </DraggableItem>
  );
}

const MemoizedAppointment = React.memo(Appointment, (prev, next) =>
  dequal(prev, next),
);

export default MemoizedAppointment;
