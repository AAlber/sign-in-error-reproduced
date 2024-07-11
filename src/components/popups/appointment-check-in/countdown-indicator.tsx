import React, { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import useAppointmentCheckInModal from "./zustand";

type Props = {
  countDown: number;
};

export default function CountdownIndicator({ countDown }: Props) {
  const [width, setWidth] = useState(0);
  const { token } = useAppointmentCheckInModal();

  useEffect(() => {
    setWidth(100);
  }, [token]);

  // reduce the width by a factor of how much per 100ms
  const factor = 100 / ((countDown * 10) / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setWidth((prev) => prev - factor);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={classNames(
        "absolute -top-[8px] z-40 h-[2px] rounded-md bg-gradient-to-r from-primary to-primary/80",
        width < 97 && "transition-all",
      )}
      style={{ width: `${width}%` }}
    />
  );
}
