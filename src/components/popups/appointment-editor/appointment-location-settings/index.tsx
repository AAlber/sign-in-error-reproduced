import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAppointmentType } from "@/src/client-functions/client-appointment";
import useUser from "@/src/zustand/user";
import useAppointmentEditor from "../zustand";
import { AppointmentEventTypeSelector } from "./appointment-event-type-selector";
import LocationSettingsOfflineEvents from "./offline";
import LocationSettingsOnlineEvents from "./online";

export default function AppointmentLocationSettings() {
  const { isOnline, isHybrid, setOnline, appointmentId } =
    useAppointmentEditor();
  const { user } = useUser();
  const { t } = useTranslation("page");

  const appointmentType = getAppointmentType({ isOnline, isHybrid });

  useEffect(() => {
    if (
      !user.institution?.institutionSettings.appointment_default_offline ||
      appointmentId
    )
      return;

    setOnline(
      !user.institution?.institutionSettings.appointment_default_offline,
    );
  }, [user.institution?.institutionSettings.appointment_default_offline]);

  return (
    <div className="grid grid-cols-2 items-center gap-2">
      <AppointmentEventTypeSelector />
      {appointmentType === "hybrid" && (
        <>
          <LocationSettingsOfflineEvents />
          <LocationSettingsOnlineEvents />
        </>
      )}
      {appointmentType === "in-person" && <LocationSettingsOfflineEvents />}
      {appointmentType === "online" && <LocationSettingsOnlineEvents />}
    </div>
  );
}
