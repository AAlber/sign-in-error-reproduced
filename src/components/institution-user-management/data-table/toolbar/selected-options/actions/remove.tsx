import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import { removeManyFromInstitution } from "@/src/client-functions/client-user-management";
import { useSelectMenuUserFilter } from "@/src/components/institution-user-management/select-menu/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { toast } from "@/src/components/reusable/toaster/toast";
import { useInstitutionUserManagement } from "../../../../zustand";

export function ActionRemove() {
  const { users, setUsers } = useInstitutionUserManagement();
  const { userId } = useAuth();
  const { t } = useTranslation("page");
  const queryClient = useQueryClient();
  const { filteredUserIds, removeUsersFromFilter, emptyFilter } =
    useSelectMenuUserFilter();

  return (
    <DropdownMenuItem
      onClick={() => {
        if (userId && filteredUserIds.includes(userId)) {
          return toast.warning("toast.user_management_warning_remove_youself", {
            icon: "🫵",
            description:
              "toast.user_management_warning_remove_youself_description",
          });
        }
        if (filteredUserIds.length === 0) {
          return;
        }

        confirmAction(
          async () => {
            const newUsers = users.filter(
              (user) => !filteredUserIds.includes(user.id),
            );
            setUsers(newUsers);
            await toast.transaction({
              transaction: () => removeManyFromInstitution(filteredUserIds),
              successMessage: "toast.user_management_delete_users_success",
              errorMessage: "toast.user_management_delete_users_error",
              processMessage: "toast.user_management_delete_users_process",
            });

            removeUsersFromFilter(filteredUserIds);

            await queryClient.invalidateQueries({
              queryKey: ["getAllUsersOfInstitution"],
            });
            emptyFilter();
          },
          {
            title: `${t("general.delete")} ${filteredUserIds.length} ${t(
              "organization_settings.confirm_action_remove_users_title2",
            )}`,
            description:
              "organization_settings.confirm_action_remove_users_description",
            actionName: "general.delete",
            requiredConfirmationCode: true,
            dangerousAction: true,
          },
        );
      }}
    >
      <Trash className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">{t("general.delete")}</span>
    </DropdownMenuItem>
  );
}
