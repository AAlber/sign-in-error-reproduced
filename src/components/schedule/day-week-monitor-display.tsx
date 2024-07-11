import React from "react";
import useScheduleSlider from "../schedule-slider/zustand";
import Schedule from "./index";

export const DayWeekMonitorDisplay = () => {
  const { filteredLayerIds } = useScheduleSlider();

  return (
    <div className="size-full">
      <Schedule filteredLayerIds={filteredLayerIds} />
    </div>
  );
};
