import { useEffect, useState } from "react";
import useAppointmentEditor from "../components/popups/appointment-editor/zustand";

// Round up to nearest 5 minutes.
// Ensures current time is not set in the past.
// Example: 5:21 rounds to 5:25, not 5:20.
export const getCurrentTime = (currentDate?: Date) => {
  const now = currentDate ? currentDate : new Date();
  const currentHour = String(now.getHours()).padStart(2, "0");
  let currentMinute = now.getMinutes();
  const remainder = currentMinute % 5;

  if (remainder !== 0) {
    currentMinute += 5 - remainder;
  }

  // adjusts hour
  if (currentMinute >= 60) {
    currentMinute -= 60;
    const hour = now.getHours() + 1;
    return `${String(hour).padStart(2, "0")}:${String(currentMinute).padStart(
      2,
      "0",
    )}`;
  }

  return `${currentHour}:${String(currentMinute).padStart(2, "0")}`;
};

export const generateTimeOptions = (interval = 5) => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = String(hour).padStart(2, "0");
      const formattedMinute = String(minute).padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

export const useHandleStartTime = (dateTime: Date) => {
  const [startTime, setStartTime] = useState<string>();
  const {
    dateTime: appointmentDateTime,
    appointmentId,
    initSource,
  } = useAppointmentEditor.getState();

  useEffect(() => {
    if (initSource === "schedule") {
      setStartTime(getCurrentTime(new Date(dateTime)));
      return;
    }
    if (initSource === "settings" && !!appointmentId) {
      setStartTime(getCurrentTime(new Date(appointmentDateTime)));
      return;
    }

    if (initSource === "default" && appointmentDateTime) {
      setStartTime(getCurrentTime(new Date(appointmentDateTime)));
      return;
    }
  }, [appointmentId, dateTime]);

  return { startTime, setStartTime };
};
