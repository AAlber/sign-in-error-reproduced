import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AppointmentItem from "../../course/info/upcoming-event/appointment-item";
import NoUpcomingEvents from "../../course/info/upcoming-event/no-appointments";
import Spinner from "../../spinner";
import useSchedule from "../zustand";

export const SpecificDayAppointmentsList = () => {
  const { appointments, loading, selectedDay } = useSchedule();
  const { t } = useTranslation("page");
  return (
    <div className="h-full w-full p-4">
      <p className="text-md mb-2 text-start font-semibold text-contrast">
        {t("schedule_events_on")} {dayjs(selectedDay).format("DD. MMM")}
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner size="w-5 h-5" />
        </div>
      ) : (
        <div className="flex flex-col">
          {!!appointments.length ? (
            appointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointments={appointments}
                appointment={appointment}
                isNextAppointment={true}
              />
            ))
          ) : (
            <div className="mt-4 h-[200px]">
              <NoUpcomingEvents />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
