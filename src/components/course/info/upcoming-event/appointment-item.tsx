import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAppointmentType,
  hasHappened,
} from "@/src/client-functions/client-appointment";
import classNames from "@/src/client-functions/client-utils";
import AppointmentPopover from "@/src/components/schedule/appointment-popover";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import useCourse from "../../zustand";
import { Check, X } from "lucide-react";

type AppointmentItemProps = {
  appointments: ScheduleAppointment[];
  appointment: ScheduleAppointment;
  isNextAppointment: boolean;
  nextAppointmentRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export default function AppointmentItem({
  appointments,
  appointment,
  isNextAppointment,
  nextAppointmentRef,
}: AppointmentItemProps) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const { user } = useUser();
  dayjs.locale(user.language);
  const { hasSpecialRole } = useCourse();
  const { t } = useTranslation("page");

  const showLines =
    appointments.indexOf(appointment) !== appointments.length - 1;

  const appointmentType = getAppointmentType({
    isOnline: appointment.isOnline,
    isHybrid: appointment.isHybrid,
  });

  const showHybridEventLabel =
    (!appointment.onlineAddress ||
      (appointment.onlineAddress &&
        !appointment.onlineAddress.split("://")[1])) &&
    !appointment.address &&
    !appointment.roomId;

  return (
    <div
      ref={isNextAppointment && nextAppointmentRef ? nextAppointmentRef : null}
      key={appointment.id}
      className="mt-px w-full"
    >
      <div
        className={classNames(
          "px-2 pb-2 pt-2",
          "text-contrast hover:bg-accent/50",
          "group relative flex w-full items-start gap-2.5 rounded-md text-xs leading-5",
        )}
      >
        <div className="relative mt-1.5 flex flex-col items-center gap-1 self-stretch">
          {isNextAppointment ? (
            !hasSpecialRole && appointment.hasAttended ? (
              <Check className="size-4 text-positive" />
            ) : <div className="size-4" />
          ) : !hasHappened(appointment) ? (
            appointment.hasAttended ? (
              <Check className="size-4 text-positive" />
            ) : <div className="size-4" />
          ) : hasSpecialRole ? (
            <Check className="size-4 text-positive" />
          ) : appointment.hasAttended ? (
            <Check className="size-4 text-positive" />
          ) : (
            <X className="size-4 text-destructive" />
          )}
        </div>
        <div className="flex w-full flex-col items-start">
          <AppointmentPopover
            appointment={appointment}
            open={isPopoverOpen}
            setOpen={setPopoverOpen}
          >
            <div className="absolute inset-0"></div>
          </AppointmentPopover>
          <p
            className={classNames(
              "flex w-full items-center justify-between text-start",
              "text-sm font-medium",
              hasHappened(appointment)
                ? "text-muted-contrast"
                : "text-contrast",
            )}
          >
            {appointment.title}
            <div className="flex shrink-0 items-center gap-2 text-xs font-normal text-muted-contrast">
              <span>{dayjs(appointment.dateTime).format("DD MMM HH:mm")}</span>
            </div>
          </p>
          <>
            {appointment.roomId && (
              <p className={"text-muted-contrast"}>
                {(appointment.roomId &&
                  appointment.room &&
                  appointment.room.name &&
                  appointment.room.name) ||
                  t("course_appointments_display_upcoming_events_uknown_room")}
              </p>
            )}

            {appointmentType === "hybrid" ? (
              <>
                {!appointment.roomId && (
                  <p className={"text-muted-contrast"}>{appointment.address}</p>
                )}

                {appointment.onlineAddress &&
                  appointment.onlineAddress.split("://")[1] && (
                    <p className={"text-muted-contrast"}>
                      {appointment.onlineAddress.split("://")[1]!.split("/")[0]}
                    </p>
                  )}

                {showHybridEventLabel && (
                  <p className={"text-muted-contrast"}>
                    {t(
                      "course_appointments_display_upcoming_events_hybrid_event",
                    )}
                  </p>
                )}
              </>
            ) : (
              <>
                {appointmentType === "online" && (
                  <p className={"text-muted-contrast"}>
                    {appointment.onlineAddress
                      ?.split("://")[1]
                      ?.split("/")[0] ||
                      appointment.address?.split("://")[1]?.split("/")[0] || // allows for backward compatibility
                      t(
                        "course_appointments_display_upcoming_events_online_event",
                      )}
                  </p>
                )}

                {appointmentType === "in-person" && !appointment.roomId && (
                  <p className={"text-muted-contrast"}>{appointment.address}</p>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
