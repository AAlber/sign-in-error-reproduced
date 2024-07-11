import useWorkbench, { WorkbenchMode } from "../../../zustand";
import TaskInput from "../../misc/task-input";
import FilloutMode from "./fillout-mode";
import ReviewOrCreateMode from "./review-or-create-mode";
import type { ITextElementProps } from "./types";

export const ElementBody = (elementId) => {
  return (
    <div className="flex w-full flex-col">
      <TaskInput elementId={elementId} />
      <AnswerSection elementId={elementId} />
    </div>
  );
};

const AnswerSection: React.FC<Pick<ITextElementProps, "elementId">> = (
  props,
) => {
  const { elementId } = props;
  const { getElementMetadata, mode } = useWorkbench();
  const answer = getElementMetadata(elementId).answer ?? "";

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg">
      {mode === WorkbenchMode.FILLOUT ? (
        <FilloutMode answer={answer} elementId={elementId} />
      ) : (
        <ReviewOrCreateMode answer={answer} mode={mode} />
      )}
    </div>
  );
};
