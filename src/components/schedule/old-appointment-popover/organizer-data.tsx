import classNames from "@/src/client-functions/client-utils";
import type { ScheduleAppointment } from "@/src/types/appointment.types";

type Props = {
  appointment: ScheduleAppointment;
  showSelectedDataForDisplay?: boolean; // for "monitor" view only
};
export default function OrganizerData({
  appointment,
  showSelectedDataForDisplay = false,
}: Props) {
  const hasOrganizerData =
    appointment.organizerData && appointment.organizerData.length > 0;

  if (!hasOrganizerData) return null;

  return (
    <>
      {appointment.organizerData!.map((organizer, idx) => (
        <div
          key={organizer.name + idx}
          className={classNames("flex items-center gap-2")}
        >
          <span>
            {showSelectedDataForDisplay
              ? organizer.selectedDataForDisplay
              : organizer.name}
          </span>
        </div>
      ))}
    </>
  );
}
