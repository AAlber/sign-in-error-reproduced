import dayjs from "dayjs";
import { Calendar, Clock } from "lucide-react";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import OrganizerData from "./organizer-data";

export default function AppointmentGeneralData({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) {
  const { user } = useUser();
  dayjs.locale(user.language);
  return (
    <>
      <div className="flex cursor-default flex-wrap items-center gap-4 text-xs text-muted-contrast">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{dayjs(appointment.dateTime).format("ddd. MMM DD")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {dayjs(appointment.dateTime).format("HH:mm")} -{" "}
            {dayjs(appointment.dateTime)
              .add(appointment.duration, "minute")
              .format("HH:mm")}
          </span>
        </div>
        <OrganizerData appointment={appointment} />
      </div>
    </>
  );
}
