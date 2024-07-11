import React from "react";
import { SelectTimeArea } from "./select-time-area";
import { SelectTimeFrequency } from "./select-time-frequency";
import { SelectTimeWeekSpan } from "./select-time-week-span";

type TimeSlotSelectorsProps = {
  children?: React.ReactNode;
};

const TimeSlotSelectorsComponent: React.FC<TimeSlotSelectorsProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};

interface TimeSlotSelectorsComponentType
  extends React.FC<TimeSlotSelectorsProps> {
  SelectTimeFrequency: typeof SelectTimeFrequency;
  SelectTimeWeekSpan: typeof SelectTimeWeekSpan;
  SelectTimeArea: typeof SelectTimeArea;
}

const TimeSlotSelectors =
  TimeSlotSelectorsComponent as TimeSlotSelectorsComponentType;

TimeSlotSelectors.SelectTimeFrequency = SelectTimeFrequency;
TimeSlotSelectors.SelectTimeWeekSpan = SelectTimeWeekSpan;
TimeSlotSelectors.SelectTimeArea = SelectTimeArea;

export default TimeSlotSelectors;
