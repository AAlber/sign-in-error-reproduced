import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteInstitutionUserGroup } from "@/src/client-functions/client-institution-user-groups";
import confirmAction from "@/src/client-functions/client-options-modal";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { useInstitutionGroupList } from "../zustand";

export default function GroupRemoveFromInstitution({ id }: { id: string }) {
  const { groups, setGroups } = useInstitutionGroupList();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      className="flex w-full px-2 "
      onClick={() =>
        confirmAction(
          () => {
            setGroups(groups.filter((group) => group.id !== id));
            deleteInstitutionUserGroup(id);
          },
          {
            title:
              t("general.delete") +
              groups.find((group) => group.id === id)?.name,
            description:
              "organization_settings.confirm_action_delete_group_description",
            actionName: "general.delete",
            dangerousAction: true,
          },
        )
      }
    >
      <Trash className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive ">
        {t(
          "organization_settings.user_management_table_main_dropdown_manage_delete",
        )}
      </span>
    </DropdownMenuItem>
  );
}
