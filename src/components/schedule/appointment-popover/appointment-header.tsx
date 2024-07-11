import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { Button } from "../../reusable/shadcn-ui/button";
import { AppointmentOptionsDropdown } from "./appointment-admin-options-dropdown";

type AppointmentHeaderProps = {
  appointment: ScheduleAppointment;
  showOptions?: boolean;
};
export const AppointmentHeader = ({
  appointment,
  showOptions = true,
}: AppointmentHeaderProps) => {
  return (
    <div className="mb-2 flex w-full flex-col">
      <div className="relative flex items-start justify-between">
        <p>{appointment.title}</p>
        {showOptions && (
          <>
            <AppointmentOptionsDropdown appointment={appointment}>
              <Button variant={"ghost"} size={"iconSm"}>
                <MoreHorizontal className="size-5" />
              </Button>
            </AppointmentOptionsDropdown>
          </>
        )}
      </div>
      <div className="relative flex items-center gap-2 text-sm text-muted-contrast">
        <p className="">{dayjs(appointment.dateTime).format("ddd MMM DD")}</p>
        <p>
          {dayjs(appointment.dateTime).format("HH:mm")} -{" "}
          {dayjs(appointment.dateTime)
            .add(appointment.duration, "minute")
            .format("HH:mm")}
        </p>
      </div>
    </div>
  );
};
