import { getAppointmentType } from "@/src/client-functions/client-appointment";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { OnlineButton } from "./online-button";
import { ProviderButton } from "./provider-button";

export const AppointmentButtons = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  const appointmentType = getAppointmentType({
    isOnline: appointment.isOnline,
    isHybrid: appointment.isHybrid,
  });

  const isOnlineOrHybrid =
    appointmentType === "online" || appointmentType === "hybrid";

  return (
    <>
      {isOnlineOrHybrid && appointment.provider === "custom" && (
        <OnlineButton appointment={appointment} />
      )}
      {isOnlineOrHybrid && appointment.provider !== "custom" && (
        <ProviderButton appointment={appointment} />
      )}
    </>
  );
};
