import { dequal } from "dequal";
import React from "react";
import { getGridStyle } from "@/src/client-functions/client-schedule";
import type { Props as AppointmentListProps } from "../appointment";
import { DraggableItem } from "../draggable-item";
import DraftContent from "./content";

function AppointmentDraft({
  appointment,
  offset,
  monitorMode,
}: AppointmentListProps) {
  return (
    <DraggableItem
      id={appointment.id}
      style={getGridStyle(appointment, offset)}
      metadata={{
        appointmentType: "draft",
        originalDateTime: appointment.dateTime,
        originalDuration: appointment.duration,
      }}
    >
      <DraftContent appointment={appointment} monitorMode={monitorMode} />
    </DraggableItem>
  );
}

const MemoizedAppointmentDraft = React.memo(AppointmentDraft, (prev, next) =>
  dequal(prev, next),
);

export default MemoizedAppointmentDraft;
