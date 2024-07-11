import { useDndContext } from "@dnd-kit/core";
import type { AppointmentWithRowData } from "../../zustand";
import { MIN_GRID_SPAN, MINUTE_INTERVALS_IN_HOUR } from "../config";
import { useCalendarDrag } from "../zustand";

type Props = {
  appointmentsList: AppointmentWithRowData[];
};

export default function DragOverlay({ appointmentsList }: Props) {
  const { active } = useDndContext();
  const [gridOverlayPosition, isResizing] = useCalendarDrag((state) => [
    state.gridOverlayPosition,
    state.isResizing,
  ]);

  const duration = appointmentsList.find((i) => i.id === active?.id)?.duration;

  if (!duration || !gridOverlayPosition || isResizing) return null;
  return (
    <li
      style={{
        gridArea: `${gridOverlayPosition.row} / ${
          gridOverlayPosition.col
        } / span ${
          duration / MINUTE_INTERVALS_IN_HOUR
        } / span ${MIN_GRID_SPAN}`,
      }}
      className="z-30 flex items-center justify-center rounded-md border border-dashed border-border bg-muted/50"
    />
  );
}
