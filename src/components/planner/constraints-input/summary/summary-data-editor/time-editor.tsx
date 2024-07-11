import { dequal } from "dequal";
import React from "react";
import TimePicker from "@/src/components/reusable/date-time-picker/time-picker";
import usePlanner from "../../../zustand";
import type { SummaryDataEditorProps } from "./index";

const TimeEditor = (props: SummaryDataEditorProps) => {
  const updateDraftAppointment = usePlanner(
    (state) => state.updateDraftAppointment,
  );

  const oldDateTime = new Date(props.data);
  return (
    <TimePicker
      dateTime={new Date(props.data)}
      onSelect={(newTime) => {
        const updatedDateTime = new Date(
          oldDateTime.getFullYear(),
          oldDateTime.getMonth(),
          oldDateTime.getDate(),
          newTime.getHours(),
          newTime.getMinutes(),
          newTime.getSeconds(),
        );
        updateDraftAppointment(props.id, { dateTime: updatedDateTime });
      }}
    >
      {props.children}
    </TimePicker>
  );
};

export const SummaryTimeEditor = React.memo(TimeEditor, (prev, next) =>
  dequal(prev.data, next.data),
);
