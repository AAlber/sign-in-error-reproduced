import type { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteInstitutionRooms } from "@/src/client-functions/client-institution-room";
import confirmAction from "@/src/client-functions/client-options-modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useUserGroupModal } from "./group-modal/zustand";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UserManagementTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;
  const { openGroupCreation } = useUserGroupModal();
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-2">
        {hasSelectedRows && (
          <Button
            variant={"destructive"}
            onClick={() => {
              const selectedRows = table.getFilteredSelectedRowModel().rows;
              const selectedRowIds = selectedRows.map(
                (row) => (row.original as any).id,
              );
              confirmAction(
                () => {
                  deleteInstitutionRooms(selectedRowIds);
                  table.setRowSelection({});
                },
                {
                  title: `${t(
                    "organization_settings.confirm_action_delete_groups_title1",
                  )} ${selectedRows.length} ${t(
                    "organization_settings.confirm_action_delete_groups_title2",
                  )}`,
                  description:
                    "organization_settings.confirm_action_delete_groups_description",
                  actionName: "general.delete",
                  requiredConfirmationCode: true,
                  dangerousAction: true,
                },
              );
            }}
          >
            {t("organization_settings.user_management_delete_group")}
          </Button>
        )}
        <Button variant={"cta"} onClick={openGroupCreation}>
          {<Plus className="mr-1 h-4 w-4 " />}
          {t("organization_settings.user_management_new_group")}
        </Button>
      </div>
    </div>
  );
}
