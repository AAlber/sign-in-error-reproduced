import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { DependencyList } from "react";
import { useEffect } from "react";
import {
  getAppointments,
  getAppointmentsOfWeek,
} from "@/src/client-functions/client-appointment";
import { useDragManager } from "@/src/client-functions/client-schedule";
import type { SCHEDULE_DISPLAY } from "../zustand";
import useSchedule from "../zustand";
import useScheduleFilter from "../zustand-filter";
import { APPOINTMENTS_QUERY_KEY, MIN_GRID_SPAN } from "./config";

export const useGetAppointmentsForSchedule = (
  scheduleDisplay: SCHEDULE_DISPLAY,
  additionalDependencies: DependencyList = [],
  appointmentsOfUserId: string,
) => {
  const {
    refresh,
    appointments,
    selectedWeek,
    selectedDay,
    canCreate,
    setLoading,
    setAppointments,
  } = useSchedule();
  const { filteredLayers, onlyOrganizedByMe } = useScheduleFilter();

  const dependencies = [
    scheduleDisplay === "day" ? selectedDay : selectedWeek,
    selectedWeek,
    filteredLayers,
    refresh,
    onlyOrganizedByMe,
    ...additionalDependencies,
  ];

  const { data, isLoading, isFetching } = useQuery(
    [...APPOINTMENTS_QUERY_KEY, appointmentsOfUserId, ...dependencies],
    {
      queryFn: () =>
        scheduleDisplay === "day"
          ? getAppointments(
              selectedDay,
              filteredLayers,
              onlyOrganizedByMe,
              appointmentsOfUserId,
            )
          : getAppointmentsOfWeek(
              selectedWeek,
              filteredLayers,
              onlyOrganizedByMe,
              appointmentsOfUserId,
            ),
    },
  );

  const isReallyLoading = isLoading || isFetching;

  useEffect(() => {
    setLoading(isReallyLoading);
  }, [isReallyLoading]);

  useEffect(() => {
    const draftAppointments = appointments.filter((a) => a.type === "draft");
    setAppointments(
      data ? [...data, ...draftAppointments] : [...draftAppointments],
    );
  }, [data]);

  return {
    appointments,
    canCreate,
    loading: isReallyLoading,
    selectedWeek,
    selectedDay,
    setAppointments,
  };
};

/**
 * Hook for managing time range selection (by dragging), in components where select-and-drag functionality
 * is needed to select time rangers, such as in the `week-display` component.
 * It utilizes the `useDragManager` hook to handle drag-related states and provides calculated values for grid positioning & time formatting in the .
 *
 * @param {number} minRowHeight
 * @param {number} totalColumns
 */
export const useScheduleAppointmentDragManager = (
  minRowHeight: number,
  totalColumns: number,
) => {
  const {
    hasMouseMoved,
    isDragging,
    dragStart,
    dragEnd,
    startDate,
    endDate,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragManager(totalColumns, minRowHeight);

  const isDragValid = isDragging && hasMouseMoved && !!dragStart && !!dragEnd;

  const calculateGridColumn = () => {
    if (!isDragValid) return;

    const base = Math.floor(dragStart.col / MIN_GRID_SPAN) * MIN_GRID_SPAN;
    return `${base + 1} / ${base + 11}`;
  };

  const calculateGridRow = () => {
    if (!isDragValid) return;

    const maxRow =
      dragEnd.row >= dragStart.row
        ? Math.max(dragEnd.row, dragStart.row + minRowHeight)
        : dragStart.row + minRowHeight;
    return { gridRow: `${dragStart.row} / ${maxRow}`, endRow: maxRow };
  };

  const formatTime = (date: Date | null) => dayjs(date).format("HH:mm");

  return {
    dragStart,
    dragEnd,
    isDragValid,
    gridColumn: calculateGridColumn(),
    gridRow: calculateGridRow()?.gridRow,
    formattedStartTime: formatTime(startDate),
    formattedEndTime: formatTime(endDate),
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    newEndTime: endDate,
    endRow: calculateGridRow()?.endRow,
  };
};
