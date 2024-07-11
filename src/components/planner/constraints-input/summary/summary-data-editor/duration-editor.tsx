import DurationSelector from "../../../../popups/appointment-editor/appointment-datetime-input/recurrence-options/duration-selector";
import usePlanner from "../../../zustand";
import type { SummaryDataEditorProps } from "./index";

export const SummaryDurationEditor = (props: SummaryDataEditorProps) => {
  const updateDraftAppointment = usePlanner(
    (state) => state.updateDraftAppointment,
  );

  return (
    <DurationSelector
      value={props.data}
      onChange={(value) =>
        updateDraftAppointment(props.id, { duration: value })
      }
    >
      {props.children}
    </DurationSelector>
  );
};
