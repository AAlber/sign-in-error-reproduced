import * as Sentry from "@sentry/nextjs";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { convertTimeToUserTimezone } from "@/src/client-functions/client-utils";
import api from "@/src/pages/api/api";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import useCourse from "../../zustand";

// Fetch upcoming appointments for a course
async function fetchUpcomingAppointments(courseId) {
  return log.timespan("Fetch upcoming course appointments", async () => {
    try {
      const response = await fetch(
        api.getCourseUpcomingAppointments + "?layerId=" + courseId,
        { method: "GET" },
      );
      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to fetch upcoming appointments");
      }
      const data = await response.json();
      return data.appointments || [];
    } catch (e) {
      log.error(e);
      return [];
    }
  });
}

// Fetch attendance information for appointments
async function fetchAppointmentsWithAttendance(appointmentIds) {
  return log.timespan("Fetch appointments with attendance", async () => {
    try {
      const response = await fetch(
        api.getAppointmentsWithAttendenceOfUser +
          "?appointmentIds=" +
          appointmentIds.join(","),
        { method: "GET" },
      );
      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to fetch appointments with attendance");
      }
      return await response.json();
    } catch (error) {
      log.error(error);
      Sentry.captureException(error);
      return {};
    }
  });
}

function useUpcomingAppointments() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { course, hasSpecialRole, appointments, setAppointments } = useCourse();
  const [isLoading, setIsLoading] = useState(true);
  const [nextUp, setNextUp] = useState<ScheduleAppointment | null>(null);
  const nextAppointmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      if (!course.layer_id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetchedAppointments = await fetchUpcomingAppointments(
        course.layer_id,
      );

      if (!fetchedAppointments.length) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      const events = fetchedAppointments.map((appointment) => ({
        ...appointment,
        dateTime: convertTimeToUserTimezone(appointment.dateTime),
      }));
      setAppointments(events);

      if (!hasSpecialRole) {
        const attendanceData = await fetchAppointmentsWithAttendance(
          events.map((event) => event.id),
        );
        setAppointments(
          events.map((appointment) => ({
            ...appointment,
            hasAttended: attendanceData[appointment.id],
          })),
        );
      }

      setIsLoading(false);
    }

    loadData();
  }, [course.layer_id, setAppointments, hasSpecialRole]);

  useEffect(() => {
    const futureAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.dateTime).getTime() +
          appointment.duration * 60 * 1000 >
        new Date().getTime(),
    );

    const nextAppointment = futureAppointments.sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    )[0];

    setNextUp(nextAppointment || null);
  }, [appointments]);

  useEffect(() => {
    if (nextUp && nextAppointmentRef.current) {
      log.info("Scrolling to next appointment", nextUp);
      nextAppointmentRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "end",
      });
    }
  }, [nextUp]);

  return { isLoading, appointments, nextUp, nextAppointmentRef };
}

export default useUpcomingAppointments;
