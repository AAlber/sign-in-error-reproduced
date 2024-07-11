import { useDndContext } from "@dnd-kit/core";
import React, { useState } from "react";
import { getBaseClassNames } from "@/src/client-functions/client-schedule";
import { convertGridRowToDayjs } from "@/src/client-functions/client-schedule/drag-and-drop";
import classNames from "@/src/client-functions/client-utils";
import AppointmentPopover from "../../../appointment-popover";
import AppointmentNameAndTime from "../../appointment-name-and-time";
import AppointmentDetails from "../../details";
import { useCalendarDrag } from "../../zustand";
import styles from "../drag.module.css";
import type { Props } from "./index";

export default function AppointmentContent({
  appointment,
  monitorMode,
}: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isResizing, newDuration] = useCalendarDrag((state) => [
    state.isResizing,
    state.resizedDuration,
  ]);

  const { active } = useDndContext();
  const isAppointmentBeingResized =
    isResizing && !!newDuration && active?.id === appointment.id;

  const dayjsTime = convertGridRowToDayjs(
    active?.id === appointment.id,
    appointment.dateTime,
  );

  const _appointment = {
    ...appointment,
    dateTime: dayjsTime.toDate(),
    duration: isAppointmentBeingResized ? newDuration : appointment.duration,
  };

  const handleOpenPopover: React.MouseEventHandler = (e) => {
    e.preventDefault();
    setOpen(!active);
  };

  return (
    <AppointmentPopover
      appointment={_appointment}
      open={isOpen}
      setOpen={setOpen}
    >
      <div
        onClick={handleOpenPopover}
        className={classNames(
          getBaseClassNames(_appointment, monitorMode),
          "!border-l-4 !border-primary",
          isAppointmentBeingResized && styles.resizing,
          "w-full",
        )}
      >
        <AppointmentNameAndTime
          appointment={_appointment}
          monitorMode={monitorMode}
        />
        <AppointmentDetails
          appointment={_appointment}
          monitorMode={monitorMode}
        />
      </div>
    </AppointmentPopover>
  );
}
