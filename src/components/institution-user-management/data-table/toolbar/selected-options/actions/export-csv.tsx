import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { useTranslation } from "react-i18next";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

interface ActionRemoveProps<TData> {
  table: Table<TData>;
}

export function ActionExportCSV<TData>({ table }: ActionRemoveProps<TData>) {
  function exportCSV() {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const users: any[] = selectedRows.map((row) => row.original);

    const usersFormatted = users.map((user) => {
      return {
        Name: user.name,
        Email: user.email,
      };
    });

    const csvUsers = Papa.unparse(usersFormatted);
    const csvData = `${csvUsers}`;

    const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(csvBlob);
    downloadFileFromUrl("users.csv", url);
  }

  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2 "
      onClick={exportCSV}
    >
      <Download className="mr-3 h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("user_management.search_filter_option_more_option3")}
      </span>
    </DropdownMenuItem>
  );
}
