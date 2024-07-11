import useCourse from "@/src/components/course/zustand";
import useWorkbench, { WorkbenchMode } from "../../../zustand";
import type { SurveyLogic } from "..";
import Logic from "./logic";
import LogicDisplay from "./logic/logic-display";

export default function LogicList({ elementId }: { elementId: string }) {
  const { getElementMetadata, mode } = useWorkbench();
  const { hasSpecialRole } = useCourse();
  const logics = getElementMetadata(elementId).logics ?? [];

  return (
    <>
      {mode === WorkbenchMode.CREATE && (
        <div className="mt-3.5 flex w-full flex-col gap-4">
          {logics.map((logic: SurveyLogic, index: number) => (
            <Logic
              key={index}
              elementId={elementId}
              index={index}
              logic={logic}
            />
          ))}
        </div>
      )}
      {mode !== WorkbenchMode.CREATE && hasSpecialRole && (
        <div className="mt-3.5 flex w-full flex-col gap-4">
          {logics.map((logic: SurveyLogic, index: number) => (
            <LogicDisplay
              key={index}
              elementId={elementId}
              index={index}
              logic={logic}
            />
          ))}
        </div>
      )}
    </>
  );
}
