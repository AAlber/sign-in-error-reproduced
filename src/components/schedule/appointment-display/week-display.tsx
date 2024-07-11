import { useDndContext } from "@dnd-kit/core";
import dayjs from "dayjs";
import classNames from "@/src/client-functions/client-utils";
import TimePointerLine from "../time-pointer";
import AppointmentListWeekly from "./appointment-list-weekly";
import BorderOverlay from "./border-overlay";
import {
  CALENDAR_CONTAINER_ID,
  INTERVALS_PER_DAY,
  MIN_ROW_HEIGHT,
  REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT,
  TOTAL_COLUMNS,
} from "./config";
import DragTimeRangeBox from "./drag-time-range";
import {
  useGetAppointmentsForSchedule,
  useScheduleAppointmentDragManager,
} from "./hooks";
import { useCalendarDrag } from "./zustand";

type AppointmentWeekDisplayProps = {
  appointmentsOfUserId: string;
};

export default function AppointmentWeekDisplay({
  appointmentsOfUserId,
}: AppointmentWeekDisplayProps) {
  const { appointments, loading, selectedWeek, selectedDay } =
    useGetAppointmentsForSchedule("week", [], appointmentsOfUserId);

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
  } = useScheduleAppointmentDragManager(MIN_ROW_HEIGHT, TOTAL_COLUMNS);

  const { active } = useDndContext();
  const draggingDisabled = useCalendarDrag((state) => state.draggingDisabled);

  const selectedWeekContainsCurrentDay = selectedWeek.some((day) => {
    return dayjs(day).isSame(dayjs(), "day");
  });

  const selectedDayIsToday = dayjs(selectedDay).isSame(dayjs(), "day");

  return (
    <>
      {(selectedWeekContainsCurrentDay || selectedDayIsToday) && (
        <TimePointerLine weekView />
      )}
      <ol
        id={CALENDAR_CONTAINER_ID}
        className={classNames(
          (isDragging || active?.id) && "cursor-grabbing",
          "relative col-span-full row-start-1 grid w-full overflow-y-scroll",
        )}
        style={{
          gridTemplateRows: `${REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT}rem repeat(${INTERVALS_PER_DAY}, minmax(0, 1fr)) auto`,
          gridTemplateColumns: `repeat(${TOTAL_COLUMNS}, 1fr)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <BorderOverlay borderCount={7} />
        <DragTimeRangeBox
          isDragValid={!draggingDisabled && isDragValid}
          startTime={formattedStartTime}
          endTime={formattedEndTime}
          gridColumn={gridColumn}
          gridRow={gridRow}
        />
        {!loading && (
          <AppointmentListWeekly
            isDragValid={isDragging}
            appointments={appointments}
            selectedWeek={selectedWeek}
          />
        )}
      </ol>
    </>
  );
}
