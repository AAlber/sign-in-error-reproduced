import React from "react";
import useCourse from "../../zustand";
import ContentBlocksTable from "./blocks-table";
import TableDndContext from "./dnd-context";

export type DndTableProps = {
  items: string[];
  loading: boolean;
};

export default function DndTable({ loading }: { loading: boolean }) {
  const contentBlocks = useCourse((state) => state.contentBlocks);
  const items = contentBlocks.map((i) => i.id);
  return (
    <TableDndContext items={items} loading={loading}>
      <ContentBlocksTable items={items} loading={loading} />
    </TableDndContext>
  );
}
