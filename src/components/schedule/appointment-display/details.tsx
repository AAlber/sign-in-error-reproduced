import { useTranslation } from "react-i18next";
import { getAppointmentType } from "@/src/client-functions/client-appointment";
import OrganizerData from "../old-appointment-popover/organizer-data";
import type { AppointmentWithRowData } from "../zustand";

// components/AppointmentDetails.tsx
type AppointmentDetailsProps = {
  appointment: AppointmentWithRowData;
  monitorMode: boolean;
};

const AppointmentDetails = ({ appointment }: AppointmentDetailsProps) => {
  const { t } = useTranslation("page");
  const appointmentType = getAppointmentType({
    isOnline: appointment.isOnline,
    isHybrid: appointment.isHybrid,
  });

  const renderOnlineAddress = () => {
    if (!appointment.onlineAddress)
      return t("course_appointments_display_no_link_provided");
    return appointment.onlineAddress.split("://")[1]?.split("/")[0];
  };

  const renderAddress = () => {
    if (
      appointmentType === "online" &&
      !appointment.onlineAddress &&
      !appointment.address
    ) {
      return t("course_appointments_display_no_link_provided");
    }
    return appointment.address;
  };

  return (
    <div className="mt-1 flex flex-wrap gap-x-1 text-start text-[0.65rem] text-muted-contrast">
      {appointmentType === "hybrid" ? (
        <>
          {!appointment.roomId && (
            <p className="text-muted-contrast">{renderAddress()}</p>
          )}
          {renderOnlineAddress() && (
            <p className="text-muted-contrast">{renderOnlineAddress()}</p>
          )}
        </>
      ) : (
        <>
          {appointmentType === "online" && (
            <p className="text-muted-contrast">
              {renderOnlineAddress() || renderAddress()}
            </p>
          )}
          {appointmentType === "in-person" &&
            !appointment.roomId &&
            appointment.address && (
              <p className="text-contrast">{appointment.address}</p>
            )}
        </>
      )}
      <OrganizerData showSelectedDataForDisplay appointment={appointment} />
    </div>
  );
};

export default AppointmentDetails;
