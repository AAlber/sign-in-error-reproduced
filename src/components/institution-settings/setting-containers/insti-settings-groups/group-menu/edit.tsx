import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { useUserGroupModal } from "../group-modal/zustand";

export default function GroupEdit({ group }: { group: any }) {
  const { openSettingsForGroup } = useUserGroupModal();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      className="flex w-full px-2 "
      onClick={() => openSettingsForGroup(group)}
    >
      <Edit className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t(
          "organization_settings.user_management_table_main_dropdown_manage_edit",
        )}
      </span>
    </DropdownMenuItem>
  );
}
