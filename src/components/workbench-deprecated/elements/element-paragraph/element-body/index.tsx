import useWorkbench, { WorkbenchMode } from "../../../zustand";
import CreateMode from "./create-mode";
import FillOutMode from "./fillout-mode";

export const ElementBody = (elementId: string) => {
  const { getElementMetadata, mode } = useWorkbench();
  const paragraph = getElementMetadata(elementId).text ?? "";

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg">
      {mode === WorkbenchMode.CREATE ? (
        <CreateMode elementId={elementId} paragraph={paragraph} />
      ) : (
        <FillOutMode paragraph={paragraph} />
      )}
    </div>
  );
};
