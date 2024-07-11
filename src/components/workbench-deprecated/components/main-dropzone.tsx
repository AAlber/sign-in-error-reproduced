import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { Hand } from "lucide-react";
import { useTranslation } from "react-i18next";
import useWorkbench from "../zustand";

export default function MainDropzone() {
  const { getElementsOfCurrentPage } = useWorkbench();
  const { isOver, setNodeRef } = useDroppable({
    id: "main",
  });

  const { t } = useTranslation("page");

  if (getElementsOfCurrentPage().length > 0)
    return (
      <div
        ref={setNodeRef}
        className={clsx(
          "flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center transition-opacity ",
          isOver ? "opacity-100" : "opacity-50",
        )}
      >
        <Hand
          className="mx-auto h-7 w-7 text-muted-contrast"
          aria-hidden="true"
        />
        <span className="block text-sm font-medium text-muted-contrast">
          {t("workbench.main_dropzone_title")}
        </span>
      </div>
    );

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex h-96 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-center transition-opacity ",
        isOver ? "opacity-100" : "opacity-50",
      )}
    >
      <Hand className="mx-auto h-9 w-9 text-contrast" aria-hidden="true" />
      <span className="mt-2 block text-sm font-semibold text-muted-contrast">
        {t("workbench.main_dropzone_title")}
      </span>
    </div>
  );
}
