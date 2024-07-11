import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { de, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";
import { useUserOverview } from "../../reusable/user-overview-sheet/zustand";
import useSchedule from "../zustand";

type DetailedDayDisplayProps = {
  week?: Date[];
  useWeekState?: boolean;
};

export default function DetailedDayDisplay({
  week,
  useWeekState: useWeekZustand,
}: DetailedDayDisplayProps) {
  const {
    selectedDay,
    fullScreenView,
    setSelectedDay,
    setFullScreenView,
    selectedWeek,
    setSelectedWeek,
  } = useSchedule();

  const { user } = useUser();
  const locale = user.language === "de" ? de : enUS;
  const isViewingFromUserOverview = useUserOverview((state) => state.open);

  useEffect(() => {
    if (useWeekZustand) {
      setWeekState(selectedWeek);
    } else {
      setWeekState(week || initialWeek);
    }
  }, [selectedWeek, week, useWeekZustand]);

  const initialWeek =
    week ||
    eachDayOfInterval({
      start: startOfWeek(new Date(), { weekStartsOn: 1 }),
      end: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });

  const [weekState, setWeekState] = useState<Date[]>(initialWeek);

  if (!weekState) return null;

  const getPreviousOrNextWeek = (type: "previous" | "next") => {
    log.click(`Clicked the week (${type})`);
    const firstDay = weekState[0];
    if (firstDay) {
      const calcFunction = type === "previous" ? subDays : addDays;
      const start = startOfWeek(calcFunction(firstDay, 7), { weekStartsOn: 1 });
      const end = endOfWeek(calcFunction(firstDay, 7), { weekStartsOn: 1 });
      const newWeek = eachDayOfInterval({ start, end });
      setSelectedWeek(newWeek);
      setSelectedDay(newWeek[0]!);
    } else {
      log.error(`Week didn't have a first day when clicking ${type} week`);
    }
  };

  return (
    <>
      <div className="absolute flex gap-1">
        <Button
          variant={"ghost"}
          size={"iconSm"}
          className="ml-1 mt-1"
          onClick={() => getPreviousOrNextWeek("previous")}
        >
          <ChevronLeft className="size-4 cursor-pointer" />
        </Button>
        <Button
          className="mt-1"
          size={"iconSm"}
          variant={"ghost"}
          onClick={() => getPreviousOrNextWeek("next")}
        >
          <ChevronRight className="size-4 cursor-pointer" />
        </Button>
      </div>
      {weekState.map((day, i) => (
        <button
          key={i}
          type="button"
          onClick={() => {
            setSelectedDay(day);
            setFullScreenView("day");
          }}
          disabled={isViewingFromUserOverview}
          className={classNames(
            !isViewingFromUserOverview && "hover:bg-accent/50",
            day.toDateString() === selectedDay.toDateString() &&
              fullScreenView === "day" &&
              "bg-accent",
            "flex items-center justify-center border-border text-sm",
          )}
        >
          <span>{format(day, "EEE", { locale })}</span>
          <span
            className={classNames(
              "flex h-8 w-8 items-center justify-center p-1 text-contrast",
            )}
          >
            <div
              className={classNames(
                "flex h-full w-full items-center justify-center rounded-md text-contrast",
                isSameDay(day, new Date()) && "bg-accent",
              )}
            >
              {format(day, "d")}
            </div>
          </span>
        </button>
      ))}
    </>
  );
}
