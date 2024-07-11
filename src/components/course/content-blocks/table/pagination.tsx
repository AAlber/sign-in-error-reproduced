import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import type { ContentBlock } from "@/src/types/course.types";
import { DEFAULT_PAGINATION_PAGE_SIZE } from "./blocks-table";

interface Props {
  table: Table<ContentBlock>;
}

export default function Pagination({ table }: Props) {
  const { t } = useTranslation("page");
  const pageSize = [DEFAULT_PAGINATION_PAGE_SIZE, 50];

  return (
    <div className="flex items-center justify-between border-t border-border bg-foreground pl-20 pr-12 py-4 text-muted-contrast">
      <div className="flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length}{" "}
        {t("user_management.table_footer_rows1")}{" "}
        {table.getFilteredRowModel().rows.length}{" "}
        {t("user_management.table_footer_rows2")}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {t("user_management.table_footer_rows3")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSize.map((p) => (
                <SelectItem key={p} value={`${p}`}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center pr-3 text-sm text-contrast">
            {t("user_management.table_footer_page1")}{" "}
            {table.getState().pagination.pageIndex + 1}{" "}
            {t("user_management.table_footer_page2")} {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size={"icon"}
              onClick={() => {
                table.setPageIndex(0);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={table.previousPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={table.nextPage}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
