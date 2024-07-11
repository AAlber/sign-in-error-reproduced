import TimePointerLine from "../time-pointer";
import useSchedule from "../zustand";
import AppointmentList from "./appointment-list";
import DragTimeRangeBox from "./drag-time-range";
import {
  useGetAppointmentsForSchedule,
  useScheduleAppointmentDragManager,
} from "./hooks";

type Props = {
  appointmentsOfUserId: string;
};

export default function AppointmentDayDisplay({ appointmentsOfUserId }: Props) {
  const { appointments } = useGetAppointmentsForSchedule(
    "day",
    undefined,
    appointmentsOfUserId,
  );

  const totalColumns = 10;
  const minRowHeight = 2;
  const { canCreate } = useSchedule();
  const {
    isDragging,
    isDragValid,
    gridColumn,
    gridRow,
    formattedStartTime,
    formattedEndTime,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useScheduleAppointmentDragManager(minRowHeight, totalColumns);
  return (
    <ol
      className={`relative col-span-full row-start-1 grid w-full ${
        isDragging ? `cursor-grabbing` : ""
      }`}
      onMouseDown={canCreate ? handleMouseDown : undefined}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
        gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
      }}
    >
      <TimePointerLine />

      <DragTimeRangeBox
        isDragValid={isDragValid}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        gridColumn={gridColumn}
        gridRow={gridRow}
      />

      <AppointmentList appointments={appointments} />
    </ol>
  );
}
