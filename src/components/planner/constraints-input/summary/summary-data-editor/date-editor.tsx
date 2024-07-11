import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import usePlanner from "../../../zustand";
import type { SummaryDataEditorProps } from "./index";

export const SummaryDateEditor = (props: SummaryDataEditorProps) => {
  const updateDraftAppointment = usePlanner(
    (state) => state.updateDraftAppointment,
  );

  const dateTime = props.data as Date;
  return (
    <DatePicker
      showTime={false}
      date={new Date(dateTime)}
      onChange={(newDate) => {
        const oldDateTime = new Date(dateTime);
        const updatedDateTime = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          newDate.getDate(),
          oldDateTime.getHours(),
          oldDateTime.getMinutes(),
          oldDateTime.getSeconds(),
        );
        updateDraftAppointment(props.id, { dateTime: updatedDateTime });
      }}
    >
      {props.children}
    </DatePicker>
  );
};
