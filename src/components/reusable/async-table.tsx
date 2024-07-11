import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchX } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Skeleton from "../skeleton";
import { EmptyState } from "./empty-state";
import { Button } from "./shadcn-ui/button";
import { Input } from "./shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn-ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./shadcn-ui/table";

type AsyncTableStyleSettings = {
  rowsPerPage?: number;
  additionalComponent?: React.ReactNode;
  searchBarPosition?: "left" | "right";
  height?: number;
  showSearchBar?: boolean;
  pagination?: boolean;
  showComponentWithoutData?: boolean;
  emptyState?: React.ReactNode;
  showPaginationIfItemCountIsBelowMinRowCount?: boolean;
};

// Define the default values for some properties
const defaultSettings: AsyncTableStyleSettings = {
  searchBarPosition: "left",
  rowsPerPage: 10,
  showSearchBar: true,
  pagination: true,
  showPaginationIfItemCountIsBelowMinRowCount: true,
};

type AsyncTableProps<T> = {
  promise: () => Promise<T[]>;
  data?: T[];
  setData?: ((currentData: T[]) => void) | void;
  columns: ColumnDef<T>[];
  refreshTrigger?: any;
  topRightComponent?: JSX.Element;
  styleSettings?: AsyncTableStyleSettings;
  onDataUpdate?: (
    currentData: T[],
    setData: React.Dispatch<React.SetStateAction<T[]>>,
  ) => void;
};

export default function AsyncTable<T>({
  refreshTrigger = 0,
  styleSettings = defaultSettings,
  data: externalData,
  setData: externalSetData,
  ...props
}: AsyncTableProps<T>) {
  const { t } = useTranslation("page");
  const [localData, setLocalData] = React.useState<T[]>([]); // Local data and setData

  // Use provided data and setData or fallback to localData and setLocalData
  const data = externalData ?? localData;
  const setData = externalSetData ?? setLocalData;

  // Merge the default settings with the provided settings
  const mergedStyleSettings = React.useMemo(() => {
    return { ...defaultSettings, ...styleSettings };
  }, [styleSettings]);

  const [loading, setLoading] = React.useState<boolean>(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(
    mergedStyleSettings.rowsPerPage ?? 10,
  );

  React.useEffect(() => {
    setLoading(true);
    props.promise().then((responseData) => {
      setData(responseData);
      setLoading(false);
    });
  }, [refreshTrigger]);

  const table = useReactTable({
    data,
    columns: props.columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    },
  });

  const showPagination =
    mergedStyleSettings.pagination &&
    (mergedStyleSettings.showPaginationIfItemCountIsBelowMinRowCount
      ? data.length > mergedStyleSettings.rowsPerPage!
      : true);

  return (
    <div className="w-full">
      <div
        className={classNames(
          (mergedStyleSettings.showSearchBar === undefined ||
            mergedStyleSettings.showSearchBar === true ||
            mergedStyleSettings.additionalComponent) &&
            "pb-4",
          mergedStyleSettings.searchBarPosition === "right" &&
            "flex-row-reverse",
          "flex items-center justify-between",
        )}
      >
        {(mergedStyleSettings.showSearchBar === undefined ||
          mergedStyleSettings.showSearchBar === true) && (
          <Input
            placeholder={t("general.search")}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        )}
        {mergedStyleSettings.additionalComponent}
      </div>
      <div
        style={{ height: mergedStyleSettings.height }}
        className={classNames(
          !mergedStyleSettings.height && "h-full",
          "overflow-hidden",
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  {props.columns.map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full overflow-hidden rounded-full">
                        <Skeleton />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  {props.columns.map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-6 w-full overflow-hidden rounded-full">
                        <Skeleton />
                      </div>{" "}
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=""
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="py-4 text-center text-muted-contrast hover:bg-transparent"
                >
                  {mergedStyleSettings.emptyState ? (
                    mergedStyleSettings.emptyState
                  ) : (
                    <EmptyState
                      icon={SearchX}
                      title="empty_state.no_data"
                      description="empty_state.no_data_description"
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {mergedStyleSettings.pagination && showPagination && (
        <div className="flex items-center justify-between space-x-2 pt-6">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-contrast">
              {t("user_management.table_footer_rows3")}
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              {t("previous")}
            </Button>
            <Button
              onClick={() => {
                setCurrentPage((prevPage) => prevPage + 1);
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
