// hooks/useAppointmentList.ts
import { useMemo } from "react";
import useAdministration from "@/src/components/administration/zustand";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { AppointmentWithRowData } from "../../zustand";
import useSchedule from "../../zustand";
import useScheduleFilter from "../../zustand-filter";
import { MIN_GRID_SPAN, MINUTE_INTERVALS_IN_HOUR } from "../config";

const useAppointmentList = (appointments: ScheduleAppointment[]) => {
  const filteredLayers = useScheduleFilter((state) => state.filteredLayers);
  const isLayerAChildOf = useAdministration((state) => state.isLayerAChildOf);
  const isMonitor = useSchedule((state) => state.fullScreenView) === "monitor";

  /**
   * subtracting 1 will create space at the right, so we can still
   * click + drag at the vacant space to create new appointments
   *
   * but if currentFullscreenView is Monitor dont create space at right
   */

  let totalColumns = MIN_GRID_SPAN - 1;
  totalColumns = totalColumns + Number(isMonitor);

  return useMemo(() => {
    const filteredAppointments = !!filteredLayers.length
      ? appointments.filter(({ appointmentLayers }) =>
          appointmentLayers.some(
            ({ layer }) =>
              filteredLayers.includes(layer.id) ||
              filteredLayers.some((parentId) =>
                isLayerAChildOf(layer.id, parentId),
              ),
          ),
        )
      : appointments;

    const formattedAppointments: AppointmentWithRowData[] =
      filteredAppointments.map((appointment) => {
        const dateTime = new Date(appointment.dateTime);
        const offset = 2;

        const startRow =
          (dateTime.getHours() * 60 + dateTime.getMinutes()) /
            MINUTE_INTERVALS_IN_HOUR +
          offset;

        const span = appointment.duration / MINUTE_INTERVALS_IN_HOUR;

        return {
          ...appointment,
          startRow,
          span,
          col: 1,
          colSpan: 1, // initially set all appointments to span 1 column
        };
      });

    const sortedAppointments = formattedAppointments.sort(
      (a, b) => a.startRow - b.startRow,
    );
    const columns = new Array(totalColumns).fill(0);

    for (const appointment of sortedAppointments) {
      const endRow = appointment.startRow + appointment.span;

      for (let i = 0; i < totalColumns; i++) {
        if (columns[i] <= appointment.startRow) {
          appointment.col = i + 1;

          // Calculate the new column span
          const concurrentAppointments = sortedAppointments.filter(
            (a) =>
              a.startRow < endRow && a.startRow + a.span > appointment.startRow,
          );
          let newColSpan = Math.max(
            1,
            Math.floor(totalColumns / concurrentAppointments.length),
          );

          if (
            newColSpan < totalColumns &&
            appointment.id === concurrentAppointments.at(-1)?.id &&
            !isMonitor
          ) {
            // let the last concurrent appointment fillup remaining space
            newColSpan = newColSpan + 1;
          }

          // Assign the new column span to the appointment and update the columns
          appointment.colSpan = newColSpan;
          columns.fill(endRow, i, i + newColSpan);
          break;
        }
      }
    }

    return sortedAppointments;
  }, [appointments, filteredLayers.join(",")]);
};

export default useAppointmentList;
