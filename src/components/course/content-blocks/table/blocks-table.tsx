import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "@/src/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../reusable/shadcn-ui/table";
import useCourse from "../../zustand";
import { createContentBlockTableDef } from "./column-definition";
import type { DndTableProps } from "./dnd-table";
import Pagination from "./pagination";
import SortableTableRow from "./sortable-table-row";
import { table } from "console";

export const DEFAULT_PAGINATION_PAGE_SIZE = 20;

export default function ContentBlocksTable({ items, loading }: DndTableProps) {
  const { contentBlocks, hasSpecialRole, blocksAreLoading } = useCourse();
  const { t } = useTranslation("page");

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const defaultColumns = createContentBlockTableDef(t);

  const table = useReactTable({
    columns: defaultColumns,
    data: contentBlocks,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: DEFAULT_PAGINATION_PAGE_SIZE,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  const isDraggingDisabled =
    process.env.NODE_ENV !== "test" &&
    (blocksAreLoading ||
      !hasSpecialRole ||
      !!table.getColumn("type")?.getFilterValue() ||
      !!table.getColumn("name")?.getFilterValue() ||
      table.getState().pagination.pageSize < DEFAULT_PAGINATION_PAGE_SIZE);

  return (
    <div className="space-y-2 overflow-hidden">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {<TableHead />}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody data-testid="blocks-table-body">
            {loading ? (
              <>
                <TableRow>
                  {table.getAllColumns().map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full overflow-hidden rounded-full">
                        <Skeleton />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {table.getAllColumns().map((column, idx) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full overflow-hidden rounded-full">
                        <Skeleton />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {table.getAllColumns().map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full overflow-hidden rounded-full">
                        <Skeleton />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ) : (
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <SortableTableRow
                        draggingDisabled={isDraggingDisabled}
                        key={row.original.id}
                        row={row}
                      />
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      {t("course_main_content_block_table_no_results")}
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            )}
          </TableBody>
        </Table>
        <Pagination table={table} />
      </div>
    </div>
  );
}
