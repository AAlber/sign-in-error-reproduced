import { getTextClassNames } from "@/src/client-functions/client-schedule";
import { truncate } from "@/src/client-functions/client-utils";
import type { AppointmentWithRowData } from "../zustand";

type Props = {
  appointment: AppointmentWithRowData;
};
const AppointmentLayerName = ({ appointment }: Props) => {
  return (
    <span className="flex flex-wrap">
      <span className={getTextClassNames()}>
        {truncate(appointment.title, 30)}
      </span>
    </span>
  );
};

export default AppointmentLayerName;
