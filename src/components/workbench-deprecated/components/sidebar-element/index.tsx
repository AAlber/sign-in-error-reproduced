import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import type { WorkbenchElementType } from "../../elements/element-type";

type SidebarTypes = {
  idx: number;
  hidden?: boolean;
  element: WorkbenchElementType;
};

export function SidebarElement({ element }: SidebarTypes) {
  const { attributes, isDragging, listeners, transform, setNodeRef } =
    useDraggable({
      id: element.id,
    });

  const style = {
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
  };

  const { t } = useTranslation("page");

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      className="flex aspect-square select-none flex-col items-center justify-center gap-2 rounded-md border border-border bg-foreground p-2 text-xs text-contrast hover:bg-accent"
      style={{ cursor: "grab", textAlign: "center" }}
    >
      <div>{element.icon}</div>
      <div>{t(element.name)}</div>
    </div>
  );
}
