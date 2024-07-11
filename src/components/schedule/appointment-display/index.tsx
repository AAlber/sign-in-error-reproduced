import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useEffect } from "react";
import {
  handleDragEnd,
  handleDragMove,
  handleDragStart,
} from "@/src/client-functions/client-schedule/drag-and-drop";
import type { SCHEDULE_DISPLAY } from "../zustand";
import useSchedule from "../zustand";
import { DRAG_THRESHOLD } from "./config";
import AppointmentDayDisplay from "./day-display";
import AppointmentWeekDisplay from "./week-display";
import { useCalendarDrag } from "./zustand";

type AppointmentDisplayProps = {
  weekView: boolean;
  fullScreenView: SCHEDULE_DISPLAY;
  draggingDisabled: boolean;
  appointmentsOfUserId: string;
};

export default function AppointmentDisplay({
  weekView,
  fullScreenView,
  draggingDisabled,
  appointmentsOfUserId,
}: AppointmentDisplayProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: DRAG_THRESHOLD,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    useCalendarDrag.setState({ draggingDisabled });
    useSchedule.setState({ appointmentsOfUserId });
  }, []);

  return (
    <DndContext
      autoScroll={false}
      sensors={sensors}
      modifiers={[restrictToParentElement]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      {weekView && fullScreenView === "week" ? (
        <AppointmentWeekDisplay appointmentsOfUserId={appointmentsOfUserId} />
      ) : (
        <AppointmentDayDisplay appointmentsOfUserId={appointmentsOfUserId} />
      )}
    </DndContext>
  );
}
