import { useDndContext } from "@dnd-kit/core";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";
import usePlanner from "@/src/components/popups/planner/zustand";
import {
  DRAG_THRESHOLD,
  INTERVALS_PER_DAY,
  MIN_GRID_SPAN,
  MINUTE_INTERVALS_IN_HOUR,
} from "@/src/components/schedule/appointment-display/config";
import { useCalendarDrag } from "@/src/components/schedule/appointment-display/zustand";
import type { AppointmentWithRowData } from "@/src/components/schedule/zustand";
import useSchedule from "@/src/components/schedule/zustand";
import api from "@/src/pages/api/api";
import type {
  PaginatedAppointments,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";
import classNames, { convertTimeToUserTimezone } from "../client-utils";

export interface DragPosition {
  row: number;
  col: number;
}

interface DragManager {
  hasMouseMoved: boolean;
  isDragging: boolean;
  dragStart: DragPosition | null;
  dragEnd: DragPosition | null;
  startDate: Date | null;
  endDate: Date | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
}

export function useDragManager(
  totalColumns: number,
  minRowHeight: number,
): DragManager {
  const { selectedWeek, selectedDay, fullScreenView, canCreate } =
    useSchedule.getState();
  const { editedByDragAppointment } = usePlanner();
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragPosition | null>(null);
  const [dragEnd, setDragEnd] = useState<DragPosition | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [initialMousePosition, setInitialMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { active } = useDndContext();

  const updateDates = () => {
    if (dragStart && selectedWeek) {
      const dayOffset = Math.floor(dragStart.col / MIN_GRID_SPAN);
      const weekStartDate = new Date(selectedWeek[0]!);

      const startDateTime = new Date(weekStartDate);
      startDateTime.setDate(weekStartDate.getDate() + dayOffset);
      startDateTime.setMinutes((dragStart.row - 2) * MINUTE_INTERVALS_IN_HOUR);

      const endDateTime = new Date(startDateTime);

      if (dragEnd) {
        const duration =
          (dragEnd.row - dragStart.row) * MINUTE_INTERVALS_IN_HOUR;
        endDateTime.setMinutes(startDateTime.getMinutes() + duration);
      } else {
        const duration = minRowHeight * MINUTE_INTERVALS_IN_HOUR;
        endDateTime.setMinutes(startDateTime.getMinutes() + duration);
      }
      setStartDate(startDateTime);
      setEndDate(endDateTime);
    }
  };

  useEffect(() => {
    updateDates();
  }, [dragStart, dragEnd]);

  useEffect(() => {
    if (active?.id) resetState();
  }, [active?.id]);

  const openCreateAppointmentEditor = (
    start: { row: number; col: number },
    end: { row: number; col: number },
  ) => {
    const { initFromSchedule } = useAppointmentEditor.getState();

    const dayOffset = Math.floor(start.col / MIN_GRID_SPAN);

    const weekStartDate =
      fullScreenView === "day"
        ? new Date(selectedDay)
        : new Date(selectedWeek[0]!);

    const dateTime = new Date(weekStartDate);
    dateTime.setDate(weekStartDate.getDate() + dayOffset);
    dateTime.setMinutes(start.row * MINUTE_INTERVALS_IN_HOUR);

    const duration =
      (Math.max(end.row, start.row + minRowHeight) - start.row) *
      MINUTE_INTERVALS_IN_HOUR;

    initFromSchedule({
      dateTime,
      duration: String(duration),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canCreate) return;
    log.click("Initiating drag-to-create-appointment");
    if (useCalendarDrag.getState().isOverDraggable) return;

    setIsDragging(true);
    setDragStart({
      ...calculateGridPosition(e),
      row: calculateGridPosition(e).row,
    });
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && initialMousePosition) {
      if (e.clientY - initialMousePosition.y > DRAG_THRESHOLD) {
        setHasMouseMoved(true);
        setDragEnd(calculateGridPosition(e));
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    if (hasMouseMoved && dragStart && dragEnd) {
      // Check if the dragStart and dragEnd positions are different
      if (
        !editedByDragAppointment &&
        (dragStart.row !== dragEnd.row || dragStart.col !== dragEnd.col)
      ) {
        openCreateAppointmentEditor(
          { col: dragStart.col, row: dragStart.row - 2 },
          { col: dragEnd.col, row: dragEnd.row - 2 },
        );
      } else {
        log.warn("useDragManager - dragStart/dragEnd positions are the same", {
          dragStart,
          dragEnd,
          editedByDragAppointment,
        });
      }
    }

    resetState();
  };

  const resetState = () => {
    setHasMouseMoved(false);
    setDragEnd(null);
    setDragStart(null);
    setInitialMousePosition(null); // Reset initial mouse position
  };

  const calculateGridPosition = (e: React.MouseEvent): DragPosition => {
    const grid = e.currentTarget as HTMLElement;
    const rect = grid.getBoundingClientRect();

    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;

    const cellWidth = rect.width / totalColumns;
    const cellHeight = rect.height / INTERVALS_PER_DAY;

    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);

    return { row, col };
  };

  return {
    hasMouseMoved,
    isDragging,
    dragStart,
    dragEnd,
    startDate,
    endDate,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export const getTextClassNames = () =>
  classNames(
    "flex w-full items-center justify-between text-start",
    "text-contrast",
  );

export const getDetailsClassNames = (
  appointment: AppointmentWithRowData,
  monitorMode: boolean,
) =>
  classNames(
    getAppropriateTextSize(appointment, monitorMode),
    "text-contrast text-start",
  );

export const getAppropriateTextSize = (
  appointment: ScheduleAppointment,
  monitorMode: boolean,
) =>
  monitorMode
    ? "text-xs"
    : isBigSpaceAppointment(appointment)
    ? "text-[0.7rem]"
    : isSmallSpaceAppointment(appointment)
    ? "text-[0.65rem]"
    : "text-xs";

export const showIcon = (appointment: AppointmentWithRowData) =>
  appointment.duration > 30 && appointment.colSpan > MINUTE_INTERVALS_IN_HOUR;

export const getGridStyle = (
  appointment: AppointmentWithRowData,
  offset: number,
) => ({
  gridColumn: `${appointment.col + offset} / span ${appointment.colSpan}`,
  gridRow: `${appointment.startRow} / span ${Math.ceil(appointment.span)}`,
});

export const isBigSpaceAppointment = (appointment: ScheduleAppointment) =>
  appointment.duration > 70;

export const isSmallSpaceAppointment = (appointment: ScheduleAppointment) =>
  appointment.duration < 31;

export const getBaseClassNames = (
  appointment: AppointmentWithRowData,
  monitorMode: boolean,
) => {
  // Determine if the appointment type is "draft"
  const isDraft = appointment.type === "draft";

  // Use "muted" color if the appointment is a draft, otherwise use "primary"
  const borderColorClass = isDraft ? "border-muted" : "border-primary";
  const bgColorClass = isDraft ? "bg-muted/40" : "bg-accent";

  return classNames(
    getAppropriateTextSize(appointment, monitorMode),
    !isSmallSpaceAppointment(appointment)
      ? "pl-2.5 pr-1.5 py-1.5"
      : "pl-2 pr-1",
    `text-primary-contrast flex flex-col items-start ${borderColorClass} dark:border-accent ${bgColorClass} hover:${bgColorClass}/80`,
    "group select-none absolute inset-1 rounded-md bg-opacity-60 text-xs dark:bg-opacity-60 overflow-hidden hover:overflow-visible",
  );
};

export const getAllUpcomingAppointments = async (page: number) => {
  log.context("Getting all upcoming appointments", { page });
  return log.timespan("Fetching all upcoming appointmnets", async () => {
    try {
      const res = await fetch(`${api.getAllUpcomingAppointments}?page=${page}`);
      if (!res.ok) {
        log.warn("Failed to fetch all upcoming appointments", res);
        return null;
      }
      const data = (await res.json()) as PaginatedAppointments;
      return {
        appointments: data.appointments.map((a) => ({
          ...a,
          dateTime: convertTimeToUserTimezone(a.dateTime),
        })),
        pagination: data.pagination,
      };
    } catch (error) {
      log.error(error);
      return null;
    }
  });
};

export const selectCurrentWeek = (date: Date) => {
  const { setSelectedWeek } = useSchedule.getState();
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const week = eachDayOfInterval({ start, end });
  setSelectedWeek(week);
};

/**
 * https://stackoverflow.com/questions/36532307/rem-px-in-javascript
 * */
export function convertRemToPx(rem: number) {
  return Math.round(
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize),
  );
}
