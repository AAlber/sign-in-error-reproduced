import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import useSchedule from "../zustand";

export default function MinimalDayDisplay({ week }) {
  const currentDay = new Date();
  const { selectedDay, setSelectedDay } = useSchedule();
  const { user } = useUser();
  const locale = user.language === "de" ? de : enUS;

  return (
    <>
      {week.map((day, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSelectedDay(day)}
          className="flex flex-col items-center pb-1.5"
        >
          <span>{format(day, "EEEEE", { locale })}</span>
          <span
            className={classNames(
              day.toDateString() === currentDay.toDateString() &&
                day.toDateString() !== selectedDay.toDateString() &&
                "bg-primary/30",
              selectedDay.toDateString() === day.toDateString() &&
                "border border-primary bg-secondary ",
              "mt-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-base font-semibold text-contrast",
            )}
          >
            {format(day, "d")}
          </span>
        </button>
      ))}
    </>
  );
}
