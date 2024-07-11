import type { Table } from "@tanstack/react-table";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUser from "@/src/zustand/user";

interface ActionRemoveProps<TData> {
  table: Table<TData>;
}

export function ActionMail<TData>({ table }: ActionRemoveProps<TData>) {
  const { user: data } = useUser();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2 "
      onClick={() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedRowEmails = selectedRows.map(
          (row) => (row.original as any).email,
        );
        const mailToLink =
          "mailto:" + data.email + "?bcc=" + selectedRowEmails.join(",");
        window.open(mailToLink, "_blank");
        table.setRowSelection({});
      }}
    >
      <Mail className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("user_management.search_filter_option_more_option1")}
      </span>
    </DropdownMenuItem>
  );
}
