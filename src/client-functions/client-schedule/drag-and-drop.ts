import type { DragEndEvent, DragMoveEvent } from "@dnd-kit/core";
import { getClientRect } from "@dnd-kit/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import usePlanner from "@/src/components/planner/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { AppointmentDraggableMetadata } from "@/src/components/schedule/appointment-display/appointment-list/draggable-item";
import {
  CALENDAR_CONTAINER_ID,
  INTERVALS_PER_DAY,
  MIN_GRID_SPAN,
  MINUTE_INTERVALS_IN_HOUR,
  REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT,
  TOTAL_COLUMNS,
} from "@/src/components/schedule/appointment-display/config";
import { useCalendarDrag } from "@/src/components/schedule/appointment-display/zustand";
import useSchedule from "@/src/components/schedule/zustand";
import api from "@/src/pages/api/api";
import type { UpdateAppointmentData } from "@/src/types/appointment.types";
import { convertRemToPx } from "./index";

/***
 * Before dragging start, we need to measure the rect of the container, so we have accurate values for our time
 * and overlays, as container dimensions can have been changed because of scrolling, resizing windw, etc.
 */
export function handleSetContainerRect(element: HTMLElement) {
  const rect = getClientRect(element);

  /**
   * since 00:00 is not exactly at the top of the container, because of the extra 1.75rem,
   * we need to add this offset so that container top starts at 00:00 and not at the 1.75rem offset
   */
  const offsetFromTopOfContainer = convertRemToPx(
    REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT,
  );

  const top = rect.top + offsetFromTopOfContainer;

  const { setContainerRect } = useCalendarDrag.getState();
  setContainerRect({
    ...rect,
    top,
    element,
    rowHeight: rect.height / INTERVALS_PER_DAY, // height of a gridRow
    rowWidth: rect.width / TOTAL_COLUMNS, // width of a gridColumn
  });
}

export function handleDragStart() {
  const container = document.getElementById(CALENDAR_CONTAINER_ID);
  if (!container) return;
  handleSetContainerRect(container);
}

export function handleDragMove(e: DragMoveEvent) {
  const { containerRect } = useCalendarDrag.getState();
  if (!containerRect) return;

  const elem = e.activatorEvent.target as HTMLElement;
  const rect = getClientRect(elem);

  // position relative to container i.e. the distance of the draggedElement from its container
  const delta = {
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
  };

  const posInGridColumn = delta.x / containerRect.rowWidth;

  // lock x to gridColumn edges
  const x =
    Math.round(Math.floor(posInGridColumn) / MIN_GRID_SPAN) * MIN_GRID_SPAN + 1;

  /**
   * e.delta.y here is how far the dragged element have travelled along y-axis from its origin
   * the further we drag, the greater the distance between the dragOverlay, to fix this we just divide distance from origin by a constant
   */
  const offsetY = e.delta.y / INTERVALS_PER_DAY;
  const initialYOffset = -2; // after all computations, set how far along the y-axis will the overlay appear from the drag element at start

  const posInGridRow =
    (delta.y - offsetY) / containerRect.rowHeight - initialYOffset;

  const y = Math.floor(Math.max(posInGridRow, 1));
  useCalendarDrag.setState({
    gridOverlayPosition: { col: x, row: y },
  });
}

export function handleDragEnd(e: DragEndEvent) {
  const { gridOverlayPosition, isResizing, resizedDuration } =
    useCalendarDrag.getState();

  if (!gridOverlayPosition) return;
  const activeId = e.active.id as string;

  const { updateAppointment: updateLocalAppointment, getAppointment } =
    useSchedule.getState();

  const appointment = getAppointment(activeId);
  const selectedWeek = useSchedule.getState().selectedWeek;
  const dayIndex = Math.floor((gridOverlayPosition?.col ?? 0) / MIN_GRID_SPAN);

  const day = selectedWeek[dayIndex];
  const dayReset = dayjs(day).startOf("day");

  // 00:00 here starts at gridRow 2 as 1 is the 1.75rem offset before 00:00; each row is 5minutes
  const mins = ((gridOverlayPosition?.row ?? 2) - 2) * MINUTE_INTERVALS_IN_HOUR;

  const metadata = e.active.data.current as AppointmentDraggableMetadata;
  const duration = isResizing ? resizedDuration : appointment?.duration ?? 0;
  const dateTime = isResizing
    ? metadata.originalDateTime
    : dayReset.add(mins, "minutes").toDate();

  if (metadata.appointmentType === "draft") {
    const { updateDraftAppointment } = usePlanner.getState();
    updateDraftAppointment(activeId, { dateTime, duration });
    return;
  }

  if (metadata.appointmentType === "regular") {
    if (!appointment) throw new Error("Missing appointment");

    updateLocalAppointment(activeId, {
      dateTime,
      duration,
    });

    toast.transaction({
      successMessage: "schedule_updating_appointment.success",
      errorMessage: "schedule_updating_appointment.error",
      processMessage: !!appointment.seriesId
        ? "schedule_updating_appointment.single_occurence"
        : "schedule_updating_appointment.appointment",
      transaction: () => {
        const updateData: UpdateAppointmentData = {
          ...appointment,
          duration,
          provider: appointment.provider as any,
          dateTime: dateTime.toISOString(),
          userAttendeeIds: appointment.appointmentUsers.map((u) => u.userId),
          userGroupAttendeeIds: appointment.appointmentUserGroups.map(
            (ug) => ug.userGroupId,
          ),
          layerIds: appointment.appointmentLayers.map((i) => i.layerId),
          organizerIds: appointment.organizerUsers.map((i) => i.organizerId),
          updateSeries: false,
          roomId: appointment.roomId ?? "",
          seriesId: appointment.seriesId || undefined,
        };

        return fetch(api.updateAppointment, {
          method: "POST",
          body: JSON.stringify(updateData),
        });
      },
      errorCallback() {
        // revert to originalPosition on error
        updateLocalAppointment(activeId, {
          dateTime: metadata.originalDateTime,
          duration: metadata.originalDuration,
        });
      },
    });
  }
  useCalendarDrag.setState({ gridOverlayPosition: null });
}

export function convertGridRowToDayjs(
  isDragging: boolean,
  prevDateTime: Date,
): Dayjs {
  const { gridOverlayPosition, isResizing } = useCalendarDrag.getState();
  const gridRow = gridOverlayPosition?.row ?? 2;
  const minute = (gridRow - 2) * MINUTE_INTERVALS_IN_HOUR;

  return gridOverlayPosition && isDragging && !isResizing
    ? dayjs(prevDateTime).startOf("day").add(minute, "minutes")
    : dayjs(prevDateTime);
}

export function round5(num: number) {
  return Math.ceil(num / 5) * 5;
}
