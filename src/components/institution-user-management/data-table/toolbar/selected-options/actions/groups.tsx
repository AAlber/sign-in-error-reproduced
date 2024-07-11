import type { Table } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  removeUsersFromAllUserGroups,
  removeUsersFromUserGroups,
} from "@/src/client-functions/client-institution-user-groups";
import confirmAction from "@/src/client-functions/client-options-modal";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useInstitutionUserManagementFilter from "../../filters/zustand";

interface TableGroupsProps<TData> {
  table: Table<TData>;
}

export default function TableGroupsButton<TData>({
  table,
}: TableGroupsProps<TData>) {
  const { refreshList } = useInstitutionUserManagement();
  const { filterGroups } = useInstitutionUserManagementFilter();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRowIds = selectedRows.map((row) => (row.original as any).id);
  const { t } = useTranslation("page");

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Users className="h-4 w-4 text-contrast" />
        <span className="text-sm text-contrast">
          {t("user_management.search_filter_option_more_option2")}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="mr-5 w-[200px] !shadow-none focus:outline-none">
        {filterGroups.length > 0 && (
          <DropdownMenuItem
            className="flex w-full px-2 "
            onClick={() => {
              confirmAction(
                async () => {
                  await removeUsersFromUserGroups(
                    selectedRowIds,
                    filterGroups.map((group) => group.id),
                  );
                  table.setRowSelection({});
                  refreshList();
                },
                {
                  title:
                    "organization_settings.confirm_action_remove_filtered_groups_title",
                  description:
                    "organization_settings.confirm_action_remove_filtered_groups_description",
                  actionName:
                    "organization_settings.confirm_action_remove_filtered_groups_action",
                },
              );
            }}
          >
            <span className="text-sm text-contrast">
              {t("user_management.search_filter_option_more_option2_filtered")}
            </span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex w-full px-2 "
          onClick={() => {
            confirmAction(
              async () => {
                await removeUsersFromAllUserGroups(selectedRowIds);
                table.setRowSelection({});
                refreshList();
              },
              {
                title:
                  "organization_settings.confirm_action_remove_from_all_groups_title",
                description:
                  "organization_settings.confirm_action_remove_from_all_groups_description",
                actionName:
                  "organization_settings.confirm_action_remove_from_all_groups_action",
              },
            );
          }}
        >
          <span className="text-sm text-contrast">
            {t("user_management.search_filter_option_more_option2_all")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
