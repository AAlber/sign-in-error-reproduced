import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Row } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { isBlockOfType } from "@/src/client-functions/client-contentblock/utils";
import classNames from "@/src/client-functions/client-utils";
import { TableCell, TableRow } from "@/src/components/reusable/shadcn-ui/table";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";
import DragHandle from "./drag-handle";

type Props = {
  draggingDisabled: boolean;
  row: Row<ContentBlock>;
};

export default function SortableTableRow({ draggingDisabled, row }: Props) {
  const { hasSpecialRole, isTestingMode } = useCourse();
  const { t } = useTranslation("page");
  const block = row.original;

  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (
    !hasSpecialRole &&
    !isTestingMode &&
    (block.status === "DRAFT" || block.status === "DISABLED")
  )
    return null;

  const isDividerBlock = isBlockOfType(row.original, "Section");

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className={classNames(
        isDragging ? "bg-primary opacity-20" : "bg-foreground",
        "group",
        isDividerBlock ? "bg-accent/20" : "",
      )}
      ref={setNodeRef}
      style={style}
    >
      <TableCell className="first-of-type:!w-[10px] pl-12">
        <DragHandle
          data-testid={`blocks-table-row-handle-${row.id}`}
          disabled={draggingDisabled}
          {...attributes}
          {...listeners}
        />
      </TableCell>
      {row.getVisibleCells().map((cell) => {
        const headerName = cell.column.columnDef.header;

        const headerStatusLabel = t(
          "course_main_content_block_table_header_status",
        );
        const headerRequirementsLabel = t(
          "course_main_table_header_requirements",
        );
        const headerTypeLabel = t(
          "course_main_content_block_table_header_type",
        );

        if (
          isDividerBlock &&
          (headerName === headerStatusLabel ||
            headerName === headerRequirementsLabel)
        ) {
          return null;
        }

        return (
          <TableCell
            key={cell.id}
            {...(isDividerBlock && headerName === headerTypeLabel
              ? { colSpan: 3 }
              : {})}
            className="!py-[0.24rem] first-of-type:!w-[10px] first-of-type:!min-w-0 pr-12"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
