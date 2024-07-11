import { useDndContext } from "@dnd-kit/core";
import React from "react";
import { getBaseClassNames } from "@/src/client-functions/client-schedule";
import { convertGridRowToDayjs } from "@/src/client-functions/client-schedule/drag-and-drop";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import { useCalendarDrag } from "../../zustand";
import type { Props as AppointmentListProps } from "../appointment";
import styles from "../drag.module.css";
import Controls from "./controls";
import LeftBorderPlaceholder from "./left-border-placeholder";

export default function DraftContent({
  appointment,
  monitorMode,
}: Omit<AppointmentListProps, "offset">) {
  const { active } = useDndContext();
  const [isResizing, newDuration] = useCalendarDrag((state) => [
    state.isResizing,
    state.resizedDuration,
  ]);

  const isAppointmentBeingResized =
    isResizing && !!newDuration && active?.id === appointment.id;

  const {
    roomId,
    room,
    organizerData,
    dateTime,
    title,
    appointmentLayers,
    isOnline,
  } = appointment;

  const dayjsTime = convertGridRowToDayjs(
    active?.id === appointment.id,
    dateTime,
  );

  const _appointment = {
    ...appointment,
    dateTime: dayjsTime.toDate(),
    duration: isAppointmentBeingResized ? newDuration : appointment.duration,
  };

  return (
    <div
      className={classNames(
        "relative",
        getBaseClassNames(_appointment, monitorMode),
        isAppointmentBeingResized && styles.resizing,
        isAppointmentBeingResized && "absolute bottom-0",
      )}
    >
      <LeftBorderPlaceholder />
      <span className="flex w-full flex-wrap items-start justify-start gap-x-1 text-[0.65rem] text-muted-contrast">
        {dayjsTime.format("HH:mm")} -
        {dayjsTime.add(_appointment.duration, "minutes").format("HH:mm")}
        {roomId && (
          <p className="text-left">
            {truncate(
              (roomId && room && room.name && room.name) || "Unknown Room",
              30,
            )}
          </p>
        )}
      </span>
      <span>{title}</span>
      <div className="flex flex-wrap gap-x-1">
        {appointmentLayers.map((layer) => (
          <span className="text-muted-contrast" key={layer.id}>
            {layer.layer.name}
          </span>
        ))}{" "}
        <span className="text-muted-contrast">
          - {isOnline ? "Online" : "In-person"}
        </span>
      </div>
      {organizerData &&
        organizerData.map((organizer) => (
          <span className="text-muted-contrast" key={organizer.name}>
            {organizer.name}
          </span>
        ))}
      <Controls appointment={_appointment} />
    </div>
  );
}
