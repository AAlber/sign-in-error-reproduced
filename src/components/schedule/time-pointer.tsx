import React, { useEffect, useState } from "react";
import useSchedule from "./zustand";

export default function TimePointerLine({
  weekView = false,
}: {
  weekView?: boolean;
}) {
  const [time, setTime] = useState(new Date());
  const { weekDaysColumSize } = useSchedule();
  // Refreshes the time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Converts the current time to a percentage of the day
  const topPosition =
    ((time.getHours() * 60 + time.getMinutes()) / 1440) * 100 + 0.7;

  return (
    <div
      style={{
        position: "absolute",
        top: `${topPosition}%`,
        left: 0,
        right: 0,
        height: "1px",
        zIndex: 999,
      }}
      className="!col-span-4 bg-contrast"
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
        }}
        className="!col-span-2 "
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            left: weekView
              ? weekDaysColumSize *
                  ((time.getDay() === 0 ? 7 : time.getDay()) - 1) -
                5
              : 0,
          }}
          className="relative bg-contrast"
        />
      </div>
    </div>
  );
}
