import { addDays, addWeeks, subDays, subWeeks } from "date-fns";
import type { DependencyList, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import {
  getAllUpcomingAppointments,
  selectCurrentWeek,
} from "@/src/client-functions/client-schedule";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import useSchedule from "./zustand";

export const useGetAllUpcomingAppointments = () => {
  const [page, setPage] = useState(1);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const { allUpcomingAppointments, setAllUpcomingAppointments } = useSchedule();

  const { data, loading: fetchAppointmentsLoading } = useAsyncData(
    async () => await getAllUpcomingAppointments(page),
    page,
  );

  const nextPage = () => setPage(page + 1);

  useEffect(() => {
    if (!fetchAppointmentsLoading && data) {
      setAllUpcomingAppointments(
        data.appointments
          ? page === 1
            ? data.appointments
            : [...allUpcomingAppointments, ...data.appointments]
          : [],
      );
    }

    if (page > 1) setNextPageLoading(fetchAppointmentsLoading);
  }, [fetchAppointmentsLoading, data]);

  return {
    allUpcomingAppointments,
    loading: fetchAppointmentsLoading,
    nextPageLoading,
    pagination: data?.pagination,
    nextPage,
  };
};

/**
 * Hook to scroll to current time in the schedule
 * When `shouldScrollToExactTime` is `false`, this hook will run.
 */
export const useScheduleScrollToCurrentTime = (
  container: RefObject<HTMLDivElement>,
  containerNav: RefObject<HTMLDivElement>,
  containerOffset: RefObject<HTMLDivElement>,
  dependencies: DependencyList = [],
) => {
  const [shouldScrollToExactTime, fullScreenView, selectedDay] = useSchedule(
    (state) => [
      state.shouldScrollToExactTime,
      state.fullScreenView,
      state.selectedDay,
    ],
  );

  const selectedDayIsToday = selectedDay.getDay() === new Date().getDay();

  const scrollVerify = () => {
    if (fullScreenView === "day") {
      if (selectedDayIsToday) return new Date().getHours() * 60;
      return 420;
    }
    if (fullScreenView === "week") {
      return 420;
    } else return new Date().getHours() * 60;
  };

  const scrollToCurrentTime = () => {
    if (
      shouldScrollToExactTime ||
      !container.current ||
      !containerNav.current ||
      !containerOffset.current
    ) {
      return;
    }
    const currentMinute = scrollVerify();
    const scrollAmount = calculateScrollAmount(
      container.current,
      containerNav.current,
      containerOffset.current,
      currentMinute,
    );
    container.current!.scrollTop = scrollAmount;
  };
  useEffect(() => {
    scrollToCurrentTime();
  }, [...dependencies, fullScreenView, selectedDay]);
};

/**
 * Hook to scroll to exact time in the schedule
 * When `shouldScrollToExactTime` is `true`, this hook will run.
 * Used for example, when user clicks on the appointment search results.
 */
export const useScheduleScrollToExactTime = (
  container: RefObject<HTMLDivElement>,
  containerNav: RefObject<HTMLDivElement>,
  containerOffset: RefObject<HTMLDivElement>,
  time: Date,
  dependencies: DependencyList = [],
) => {
  const [shouldScrollToExactTime, setShouldScrollToExactTime] = useSchedule(
    (state) => [
      state.shouldScrollToExactTime,
      state.setShouldScrollToExactTime,
    ],
  );

  const scrollToExactTime = () => {
    if (!shouldScrollToExactTime) return;

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (
      !container.current ||
      !containerNav.current ||
      !containerOffset.current
    ) {
      return;
    }

    const scrollAmount = calculateScrollAmount(
      container.current,
      container.current,
      containerOffset.current,
      totalMinutes,
    );
    container.current.scrollTop = scrollAmount;
    setShouldScrollToExactTime(false);
  };

  useEffect(() => {
    scrollToExactTime();
  }, [time, ...dependencies]);
};

export const useHandleScheduleDayKeyboardNavigation = () => {
  const { selectedDay, setSelectedDay, setSelectedWeek, fullScreenView } =
    useSchedule.getState();

  // Create a ref to store the current value of current day
  // We use ref here as states won't update inside event listeners
  const currentDayRef = useRef<Date>(selectedDay);

  useEffect(() => {
    currentDayRef.current = selectedDay; // Update the ref val whenever selectedDay changes
  }, [selectedDay]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullScreenView]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (fullScreenView !== "day") return;
    if (event.key === "ArrowRight") {
      const day = addDays(currentDayRef.current, 1);
      setSelectedDay(day);
      selectCurrentWeek(day);
      return;
    }
    if (event.key === "ArrowLeft") {
      const day = subDays(currentDayRef.current, 1);
      setSelectedDay(day);
      selectCurrentWeek(day);
    }
  };
};

export const useHandleScheduleWeekKeyboardNavigation = () => {
  const { fullScreenView, selectedWeek, setSelectedDay } = useSchedule();

  // Create a ref to store the current value of current day
  // We use ref here as states won't update inside event listeners
  const currentWeekRef = useRef<Date[]>(selectedWeek);

  useEffect(() => {
    currentWeekRef.current = selectedWeek; // Update the ref val
  }, [selectedWeek]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullScreenView]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (fullScreenView !== "week" || !currentWeekRef.current[0]) return;
    let week: Date | undefined = undefined;

    if (event.key === "ArrowRight") {
      week = addWeeks(currentWeekRef.current[0], 1);
    }

    if (event.key === "ArrowLeft") {
      week = subWeeks(currentWeekRef.current[0], 1);
    }

    if (week) {
      selectCurrentWeek(week);
      setSelectedDay(week); // sets it to the first day of the week
    }
  };
};

const calculateScrollAmount = (
  container: HTMLDivElement,
  containerNav: HTMLDivElement,
  containerOffset: HTMLDivElement,
  minutes: number,
) => {
  const scrollAmount =
    ((container.scrollHeight -
      containerNav.offsetHeight -
      containerOffset.offsetHeight) *
      minutes) /
    1440; // 1440 minutes in a day

  return scrollAmount;
};
