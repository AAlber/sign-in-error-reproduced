import Skeleton from "../../skeleton";
import { ScrollArea, ScrollBar } from "../shadcn-ui/scroll-area";
import AppointmentBlock from "./appointment-block";
import useScrollToCurrentHour from "./hooks";
import TimeSlotColumn from "./time-slot";

const timeSlots = [
  "0:00",
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

type ScheduleHorizontalDayViewProps = {
  date?: Date;
  loading?: boolean;
  heigth?: number;
  appointments?: {
    id: string;
    title: string;
    dateTime: Date;
    duration: number;
  }[];
  highlightedZones?: {
    dateTime: Date;
    duration: number;
  }[];
};

export default function ScheduleHorizontalDayView({
  date,
  loading = false,
  heigth = 64,
  appointments = [],
  highlightedZones = [],
}: ScheduleHorizontalDayViewProps) {
  const scheduleDate = date ? new Date(date) : new Date();
  const scrollContainerRef = useScrollToCurrentHour(scheduleDate, open);

  return (
    <ScrollArea
      ref={scrollContainerRef}
      style={{ height: `${heigth}px` }}
      className="flex w-full items-center rounded-md border border-border"
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div
          className="relative flex w-max divide-x divide-border"
          style={{ height: `${heigth - 2}px` }}
        >
          {appointments.map((appointment) => (
            <AppointmentBlock
              key={appointment.id}
              id={appointment.id}
              heigth={heigth}
              dateTime={appointment.dateTime}
              duration={appointment.duration}
            />
          ))}
          {highlightedZones.map((appointment) => (
            <AppointmentBlock
              key={appointment.dateTime.toString()}
              highlighted
              heigth={heigth}
              dateTime={appointment.dateTime}
              duration={appointment.duration}
            />
          ))}
          {timeSlots.map((time, index) => (
            <TimeSlotColumn key={index} time={time} index={index} />
          ))}
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
