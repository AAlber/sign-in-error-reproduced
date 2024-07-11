import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../reusable/shadcn-ui/select";
import { useSelectMenuUserFilter } from "../select-menu/zustand";
import { useInstitutionUserManagement } from "../zustand";
import useInstitutionUserManagementFilter, {
  pageSizesSelection,
} from "./toolbar/filters/zustand";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("page");

  const [pageNumber, pageSize, totalPages, setPageNumber, setPageSize] =
    useInstitutionUserManagementFilter((state) => [
      state.pageNumber,
      state.pageSize,
      state.totalPages,
      state.setPageNumber,
      state.setPageSize,
    ]);

  const selectedUserIds = useSelectMenuUserFilter(
    (state) => state.filteredUserIds,
  );

  const visibleUserIdsFromCurrentPage = table
    .getRowModel()
    .flatRows.map((u) => u.original["id"]);

  const selectedCount = visibleUserIdsFromCurrentPage.reduce(
    (prev, curr) => prev + Number(selectedUserIds.includes(curr)),
    0,
  );

  const canPreviousPage = pageNumber > 1;
  const canNextPage = pageNumber < totalPages;

  return (
    <div className="sticky inset-x-0 bottom-0 flex items-center justify-between border-t border-border bg-foreground px-4 py-2 text-muted-contrast">
      <div className="flex-1 text-sm">
        {selectedCount} {t("user_management.table_footer_rows1")}{" "}
        {table.getFilteredRowModel().rows.length}{" "}
        {t("user_management.table_footer_rows2")}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {t("user_management.table_footer_rows3")}
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(+value);
              useInstitutionUserManagement.setState({ refresh: Math.random() });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizesSelection.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center pr-3 text-sm text-contrast">
            {t("user_management.table_footer_page1")} {pageNumber}{" "}
            {t("user_management.table_footer_page2")} {totalPages}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size={"icon"}
              onClick={() => setPageNumber(1)}
              disabled={!canPreviousPage}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={!canPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={!canNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => setPageNumber(totalPages)}
              disabled={!canNextPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
