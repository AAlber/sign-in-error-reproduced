import { CornerUpRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import Map from "../../reusable/map-display";
import useRoomDialog from "../../reusable/room-schedule/zustand";
import { Button } from "../../reusable/shadcn-ui/button";

export default function AppointmentRoomDisplay({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) {
  const { init } = useRoomDialog();
  const { t } = useTranslation("page");

  if (!appointment.room) return null;

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-contrast">
      {t("course_appointment_getting_there")}
      <Map height="150px" address={appointment.room.address} />
      <div className="mt-2 flex items-center justify-between gap-2 text-xs font-normal text-muted-contrast">
        <Button
          variant={"link"}
          onClick={() =>
            init({ room: appointment.room!, date: appointment.dateTime })
          }
          className={"flex h-4 items-center gap-1 px-0"}
          size={"small"}
        >
          <MapPin className="h-4 w-4" />

          <span>{appointment.room.name}</span>
        </Button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            appointment.room.address,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <CornerUpRight className="h-4 w-4 hover:text-primary" />
        </a>
      </div>
    </div>
  );
}
