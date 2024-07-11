import dayjs from "dayjs";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { getDetailsClassNames } from "@/src/client-functions/client-schedule";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import type { AppointmentWithRowData } from "../zustand";

type Props = {
  appointment: AppointmentWithRowData;
  monitorMode: boolean;
};

function AppointmentNameAndTime({ appointment, monitorMode }: Props) {
  return (
    <div className="flex w-full flex-col items-start">
      <span className="flex w-full flex-wrap items-start justify-start gap-x-1 text-[0.65rem] text-muted-contrast">
        {dayjs(appointment.dateTime).format("HH:mm")}-{" "}
        {dayjs(appointment.dateTime)
          .add(appointment.duration, "minutes")
          .format("HH:mm")}
        {appointment.roomId && (
          <p className="text-left">
            {truncate(
              (appointment.roomId &&
                appointment.room &&
                appointment.room.name &&
                appointment.room.name) ||
                "Unknown Room",
              30,
            )}
          </p>
        )}
      </span>
      <span className="flex flex-wrap font-medium">
        <span className={getDetailsClassNames(appointment, monitorMode)}>
          {truncate(appointment.title, 30)}
        </span>
      </span>
      <span
        className={classNames(
          "divide flex flex-wrap divide-x divide-dotted divide-contrast",
          getDetailsClassNames(appointment, monitorMode),
        )}
      >
        {appointment.appointmentLayers.map((appointmentLayer, idx) => (
          <p
            className={classNames(idx === 0 ? "pr-1" : "px-1")}
            key={appointmentLayer.id}
          >
            {truncate(
              structureHandler.utils.layerTree.getLayerNameToShow(
                appointmentLayer.layer,
              ),
              30,
            )}
          </p>
        ))}
      </span>
    </div>
  );
}

export default AppointmentNameAndTime;
