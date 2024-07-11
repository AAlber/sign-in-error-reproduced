import React from "react";

const TimeSlotColumn = ({ time, index }) => (
  <div
    key={index}
    data-hour={index + 1}
    className={`flex h-full w-[80px] flex-col`}
  >
    <div className="h-[32px] border-b border-border px-1 text-sm">{time}</div>
    <div className="flex h-full w-full divide-x divide-dashed divide-border">
      <div className="h-full w-full"></div>
      <div className="h-full w-full"></div>
    </div>
  </div>
);

export default TimeSlotColumn;
