import "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  checkInValidWithinMins,
  isAppointmentOngoing,
  isAppointmentToday,
  isReadyForCheckIn,
} from "@/src/client-functions/client-appointment";
import { checkInOnlineAttendence } from "@/src/client-functions/client-appointment-attendence";
import {
  copyToClipBoard,
  replaceVariablesInString,
} from "@/src/client-functions/client-utils";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import useCourse from "../../course/zustand";
import { Button } from "../../reusable/shadcn-ui/button";

export default function AppointmentLinkDisplay({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const [copyWasClicked, setCopyWasClicked] = useState(false);
  const appointmentIsToday = isAppointmentToday(appointment);
  const { t } = useTranslation("page");
  const { updateAppointment } = useCourse();

  const appointmentIsOngoing = isAppointmentOngoing(appointment);
  const appointmentIsReadyForCheckIn = isReadyForCheckIn(
    appointment.dateTime.getTime(),
    appointment.duration,
  );

  // will only be true if appointment is currently ongoing but checkInValidity is false
  const checkInHasEnded = !appointmentIsReadyForCheckIn && appointmentIsOngoing;

  const checkIn = () => {
    updateAppointment(appointment.id, { hasAttended: true });
    checkInOnlineAttendence(appointment.id);
  };

  // allows for backward compatiblity
  const appointmentOnlineAddress = appointment.isHybrid
    ? appointment.onlineAddress
    : appointment.onlineAddress || appointment.address;

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-contrast">
      <div
        className="flex cursor-pointer items-center justify-between text-muted-contrast"
        onClick={() => {
          if (!appointmentIsReadyForCheckIn) return;
          setCopyWasClicked(true);
          copyToClipBoard(appointmentOnlineAddress);
          checkIn();
        }}
      >
        {!appointmentIsReadyForCheckIn && checkInHasEnded ? (
          <p>{t("appointment.link.display.check-in-ended")}</p>
        ) : appointmentIsReadyForCheckIn ? (
          <>
            {appointmentOnlineAddress.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  {!copyWasClicked ? (
                    <Copy className="h-4 w-4 " />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <p className="break-all text-xs text-primary">
                    {appointmentOnlineAddress.length > 20
                      ? appointmentOnlineAddress.slice(0, 20) + "..."
                      : appointmentOnlineAddress}
                  </p>
                </div>
                <Button
                  variant={"cta"}
                  enabled={!appointment.hasAttended}
                  onClick={(event) => {
                    event.stopPropagation();
                    checkIn();
                    window.open(appointmentOnlineAddress, "_blank");
                  }}
                >
                  {t("appointment.join_button")}
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <p className="font-normal">
              {dayjs(new Date(appointment.dateTime)).fromNow()}{" "}
            </p>
            {appointmentIsToday && (
              <p className="font-normal">
                {replaceVariablesInString(
                  t("appointment.link.display.come-back-on"),
                  [checkInValidWithinMins],
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
