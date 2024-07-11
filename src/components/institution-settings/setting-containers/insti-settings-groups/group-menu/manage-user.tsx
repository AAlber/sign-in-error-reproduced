import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import useInstitutionUserManagementFilter from "@/src/components/institution-user-management/data-table/toolbar/filters/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export default function GroupManageUsers({ group }: { group: any }) {
  const { setFilterGroups } = useInstitutionUserManagementFilter();
  const { setPage } = useNavigation();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      className="flex w-full px-2 "
      onClick={() => {
        setFilterGroups([group]);
        setPage("USERMANAGEMENT");
      }}
    >
      <Users className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t(
          "organization_settings.user_management_table_main_dropdown_manage_users",
        )}
      </span>
    </DropdownMenuItem>
  );
}
