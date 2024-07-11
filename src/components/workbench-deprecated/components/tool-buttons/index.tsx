import useWorkbench, { WorkbenchMode, WorkbenchType } from "../../zustand";
import SaveAsDraft from "./draft-button";
import FinishButton from "./finish-button";
import PublishButton from "./publish-button";
import SaveProcess from "./save-process";
import SubmitButton from "./submit-button";

export default function ToolButtons() {
  const { mode, workbenchType } = useWorkbench();

  return (
    <>
      {workbenchType === WorkbenchType.ASSESSMENT && (
        <div className="flex items-center gap-x-2">
          {mode === WorkbenchMode.CREATE && <FinishButton />}
          {mode === WorkbenchMode.FILLOUT && <SaveAsDraft />}
          {mode === WorkbenchMode.FILLOUT && <SubmitButton />}
          {mode === WorkbenchMode.REVIEW && <PublishButton />}
        </div>
      )}
      {workbenchType === WorkbenchType.LEARNING && (
        <div className="flex items-center">
          {mode === WorkbenchMode.CREATE && <FinishButton />}
          {mode !== WorkbenchMode.CREATE && <SaveProcess />}
        </div>
      )}
    </>
  );
}
