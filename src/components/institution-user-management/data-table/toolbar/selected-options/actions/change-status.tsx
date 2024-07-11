import type { Table } from "@tanstack/react-table";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import { setStatusAndUpdateZustand } from "@/src/client-functions/client-user-management";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { useSelectMenuUserFilter } from "@/src/components/institution-user-management/select-menu/zustand";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import {
  InfoListActive,
  InfoListInactive,
} from "@/src/components/reusable/user-status-indicator/info-lists";

interface TableGroupsProps<TData> {
  table: Table<TData>;
}

export default function Status<TData>({ table }: TableGroupsProps<TData>) {
  const { t } = useTranslation("page");
  const { filteredUserIds } = useSelectMenuUserFilter();
  const Rows = table.getRowModel().rows.map((row) => row.original as any);

  const selectedRowEmails = Rows.filter(
    (row) => row.id === filteredUserIds.find((id) => id === row.id),
  ).map((row) => row.email);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Activity className="h-4 w-4 text-contrast" />
        <span className="text-sm text-contrast">{t("change_status")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="mr-5 w-[200px] !shadow-none focus:outline-none">
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() =>
            confirmAction(
              () =>
                setStatusAndUpdateZustand(
                  filteredUserIds,
                  selectedRowEmails,
                  true,
                ),
              {
                title: replaceVariablesInString(t("activate_users"), [
                  filteredUserIds.length,
                ]),
                description: replaceVariablesInString(
                  t("activate_users_description"),
                  [filteredUserIds.length],
                ),
                actionName: t("activate"),
                displayComponent: () => (
                  <InfoListActive
                    includePlanDetails
                    newUsers={filteredUserIds.length}
                  />
                ),
              },
            )
          }
        >
          <div className="relative flex w-3 items-center justify-center">
            <div className="absolute h-1.5 w-1.5 rounded-full bg-positive" />
            <div className="absolute h-1.5 w-1.5 animate-ping-slow rounded-full bg-positive" />
          </div>
          {t("active")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={() =>
            confirmAction(
              () =>
                setStatusAndUpdateZustand(
                  filteredUserIds,
                  selectedRowEmails,
                  false,
                ),
              {
                title: replaceVariablesInString(t("deactivate_users"), [
                  filteredUserIds.length,
                ]),
                description: replaceVariablesInString(
                  t("deactivate_users_description"),
                  [filteredUserIds.length],
                ),
                actionName: t("deactivate"),
                displayComponent: () => (
                  <InfoListInactive
                    includePlanDetails
                    removedUsers={filteredUserIds.length}
                  />
                ),
              },
            )
          }
        >
          <div className="flex w-3 items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-contrast" />
          </div>
          {t("inactive")}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
