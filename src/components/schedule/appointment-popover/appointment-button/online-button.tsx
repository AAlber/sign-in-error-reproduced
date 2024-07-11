import { useTranslation } from "react-i18next";
import {
  checkInValidWithinMins,
  hasHappened,
  isAppointmentOngoing,
  isReadyForCheckIn,
} from "@/src/client-functions/client-appointment";
import { checkInOnlineAttendence } from "@/src/client-functions/client-appointment-attendence";
import {
  copyToClipBoard,
  replaceVariablesInString,
} from "@/src/client-functions/client-utils";
import useCourse from "@/src/components/course/zustand";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { AppointmentButton } from "./reusable-button";

export const OnlineButton = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  const { t } = useTranslation("page");
  const appointmentOnlineAddress = appointment.isHybrid
    ? appointment.onlineAddress
    : appointment.onlineAddress || appointment.address;

  const appointmentIsReadyForCheckIn = isReadyForCheckIn(
    appointment.dateTime.getTime(),
    appointment.duration,
  );

  const appointmentIsOngoing = isAppointmentOngoing(appointment);
  const { updateAppointment } = useCourse();

  const checkIn = () => {
    updateAppointment(appointment.id, { hasAttended: true });
    checkInOnlineAttendence(appointment.id);
  };

  const appointmentHasHappened = hasHappened(appointment);
  const now = new Date().getTime();
  const appointmentStart = new Date(appointment.dateTime.getTime()).getTime();
  const appointmentEnd = new Date(
    appointmentStart + appointment.duration * 60000,
  ).getTime();

  const within1HourBeforeStart =
    appointmentStart - now <= 1 * 60 * 60 * 1000 && now < appointmentStart;
  const endedWithin24Hours =
    appointmentHasHappened && now - appointmentEnd <= 24 * 60 * 60 * 1000;

  const disableButton = now < appointmentStart && !within1HourBeforeStart;

  return (
    <AppointmentButton
      buttonText="appointment.join_button"
      tooltipText={replaceVariablesInString(
        t("appointment.link.display.come-back-on"),
        [checkInValidWithinMins],
      )}
      variant={
        appointmentIsReadyForCheckIn ||
        within1HourBeforeStart ||
        appointmentIsOngoing ||
        endedWithin24Hours
          ? "cta"
          : "default"
      }
      showCopyButton
      onClick={() => {
        if (!disableButton) {
          checkIn();
          window.open(appointmentOnlineAddress, "_blank");
        }
      }}
      onCopyClick={() => {
        if (!disableButton) {
          copyToClipBoard(appointmentOnlineAddress);
          checkIn();
        }
      }}
      disableButton={disableButton}
      disableTooltip={!appointmentOnlineAddress || !disableButton}
    />
  );
};
