import React from "react";
import { truncate } from "@/src/client-functions/client-utils";
import type { ContentBlock } from "@/src/types/course.types";
import DragHandle from "./sortable-table-row/drag-handle";

type Props = {
  block: ContentBlock | undefined;
};

export default function DndTableRowOverlay({ block }: Props) {
  return (
    <div className="flex min-h-[40px] max-w-[240px] items-center space-x-2 rounded-md border border-border bg-background px-2">
      <DragHandle />
      <span>{truncate(block?.name ?? "", 100)}</span>
    </div>
  );
}
