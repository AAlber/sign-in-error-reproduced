import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  getAppointmentType,
  hasHappened,
} from "@/src/client-functions/client-appointment";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import Divider from "../../reusable/divider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import useSchedule from "../zustand";
import AppointmentAddressDisplay from "./address-display";
import Buttons from "./buttons";
import AppointmentGeneralData from "./general-data";
import AppointmentLinkDisplay from "./link-display";
import AppointmentProviderDisplay from "./provider-display";
import AppointmentRoomDisplay from "./room-display";

export default function AppointmentPopover({
  appointment,
  children,
}: {
  appointment: ScheduleAppointment;
  children: React.ReactNode;
}) {
  const appointmentDateHasPassed = hasHappened(appointment);
  const appointmentType = getAppointmentType({
    isOnline: appointment.isOnline,
    isHybrid: appointment.isHybrid,
  });
  const { t } = useTranslation("page");
  const { selectedAppointmentFromSearch, setSelectedAppointmentFromSearch } =
    useSchedule();
  const popoverRef = useRef<HTMLButtonElement>(null);

  const isInPersonOrHybrid =
    appointmentType === "in-person" || appointmentType === "hybrid";

  const isOnlineOrHybrid =
    appointmentType === "online" || appointmentType === "hybrid";

  useEffect(() => {
    if (selectedAppointmentFromSearch?.id === appointment.id) {
      popoverRef.current?.click();
      setSelectedAppointmentFromSearch(undefined);
    }
  }, [selectedAppointmentFromSearch]);

  return (
    <Popover>
      <PopoverTrigger ref={popoverRef}>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 ">
          <p className="flex items-center justify-between font-medium text-contrast">
            {appointment.title.length > 25
              ? appointment.title.substring(0, 25) + "..."
              : appointment.title}{" "}
            <Buttons appointment={appointment} />
          </p>
          <AppointmentGeneralData appointment={appointment} />
          <Divider />
          {!appointmentDateHasPassed ? (
            <>
              {isInPersonOrHybrid && appointment.roomId && (
                <AppointmentRoomDisplay appointment={appointment} />
              )}

              {isInPersonOrHybrid && !appointment.roomId && (
                <AppointmentAddressDisplay appointment={appointment} />
              )}

              {isOnlineOrHybrid && appointment.provider === "custom" && (
                <AppointmentLinkDisplay appointment={appointment} />
              )}
              {isOnlineOrHybrid && appointment.provider !== "custom" && (
                <AppointmentProviderDisplay appointment={appointment} />
              )}
            </>
          ) : (
            <p className="text-sm text-muted-contrast">
              {t("course_appointment_event_ended")}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
