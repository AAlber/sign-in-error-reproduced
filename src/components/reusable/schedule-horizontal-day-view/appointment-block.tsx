// AppointmentBlock.tsx
import React from "react";
import classNames from "@/src/client-functions/client-utils";

const MINUTES_IN_HOUR = 60;
const SEGMENTS_PER_HOUR = 4; // 15-minute segments
const SEGMENT_WIDTH = 20;

const AppointmentBlock = ({
  id,
  dateTime = new Date(),
  duration = 60,
  heigth = 64,
  highlighted = false,
}: {
  id?: string;
  dateTime?: Date;
  duration?: number;
  heigth?: number;
  highlighted?: boolean;
}) => {
  // Convert dateTime to a segment index
  const getSegmentIndex = (dateTime) => {
    const date = new Date(dateTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (
      hours * SEGMENTS_PER_HOUR +
      Math.floor(minutes / (MINUTES_IN_HOUR / SEGMENTS_PER_HOUR))
    );
  };

  const segmentIndex = getSegmentIndex(dateTime);
  const durationInSegments = duration / (MINUTES_IN_HOUR / SEGMENTS_PER_HOUR);

  return (
    <div
      key={id}
      className={classNames(
        highlighted
          ? "z-50 !border-r border-dashed !border-muted-contrast bg-accent/50"
          : "z-20 !border-0 bg-primary",
        "absolute bottom-1 ml-[4px] rounded-md border",
      )}
      style={{
        height: `${heigth - 32}px`,
        width: `${durationInSegments * SEGMENT_WIDTH - 8}px`, // Calculate width based on duration
        left: `${segmentIndex * SEGMENT_WIDTH}px`, // Position based on start time
      }}
    />
  );
};

export default AppointmentBlock;
