import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import _debounce from "lodash/debounce";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/reusable/shadcn-ui/table";
import { useInstitutionUserManagement } from "../zustand";
import ColumnResizeHandler from "./column-resize-handler";
import { DataTablePagination } from "./data-table-pagination";
import TableBody from "./table-body";
import UnsavedChangesButton from "./unsaved-changes-indicator";
import { useTableColumn } from "./zustand";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const dataFieldsCount = useInstitutionUserManagement(
    (state) => state.dataFields.length,
  );

  const setTable = useInstitutionUserManagement((state) => state.setTable);

  /**
   * need to create a ref function here to avoid creating new
   * debounce function everytime we resize columns
   */
  const debounceRef = useRef(
    _debounce((val: { [columnSize: string]: number }) => {
      useTableColumn.getState().setTableColumnSize(val);
    }, 1000),
  );

  const table = useReactTable({
    data,
    columns: useMemo(() => columns, [dataFieldsCount]),
    manualPagination: true,
    defaultColumn: {
      minSize: 200,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualFiltering: true,
    columnResizeMode: "onChange",
    state: {
      columnFilters,
    },
  });

  const columnVarsSize = useMemo(() => {
    const headers = table.getFlatHeaders();
    const columnVars = {} as { [key: string]: number };
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      /**
       * these keys are CSS vars, which we add to Table style prop so its children (headers and cells)
       * can access and read the values, these are also the keys we persist to zustand state
       * more info and example at https://tanstack.com/table/v8/docs/guide/column-sizing#column-resize-apis
       */
      columnVars[`--header-${header.id}-size`] = header.getSize();
      columnVars[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    // side effect to also update zustand state on resize
    debounceRef.current(columnVars);
    return columnVars;
  }, [table.getState().columnSizingInfo]);

  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  useEffect(() => {
    setTable(table);
  }, [table, table.getFilteredRowModel(), hasSelectedRows]);

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="user-management-table h-auto overflow-auto rounded-md border border-border bg-foreground">
        <Table className="relative max-h-[90vh]" style={{ ...columnVarsSize }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="flex divide-x divide-border !border-b-0 [&>th:last-child]:!border-r [&>th:last-child]:!border-border"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="relative flex items-center"
                    style={{
                      width: `calc(var(--header-${header?.id}-size) * 1px)`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanResize() && (
                      <ColumnResizeHandler header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody columns={columns} table={table} />
        </Table>
        <DataTablePagination table={table} />
      </div>
      <UnsavedChangesButton />
    </div>
  );
}
