import type { ColumnDef, Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import classNames from "@/src/client-functions/client-utils";
import {
  TableBody as TBody,
  TableCell,
  TableRow,
} from "../../reusable/shadcn-ui/table";

type TBodyProps<T, V> = {
  table: Table<T>;
  columns: ColumnDef<T, V>[];
};

export default function TableBody<T, V>({ table, columns }: TBodyProps<T, V>) {
  return (
    <TBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="flex divide-x divide-border [&>td:last-child]:!border-r [&>td:last-child]:!border-border"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
                className={classNames(
                  cell.column.columnDef.id === "select" && "justify-center",
                  "truncate",
                )}
                key={cell.id}
                onClick={() => {
                  if (cell.column.id === "select") return;
                  if (cell.column.id === "menu") return;
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TBody>
  );
}
