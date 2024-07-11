import { X } from "lucide-react";
import useWorkbench from "@/src/components/workbench-deprecated/zustand";
import type { SurveyLogic } from "../..";

export default function DeleteLogicButton({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { getElementMetadata, updateElementMetadata } = useWorkbench();

  return (
    <button
      onClick={() => {
        const logics = getElementMetadata(elementId).logics;
        const index = logics?.findIndex((l) => l.id === logic.id);
        if (typeof index !== "undefined" && index !== -1) {
          logics?.splice(index, 1);
          updateElementMetadata(elementId, { logics });
        }
      }}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
