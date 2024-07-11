import { Users2Icon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useUserGroupModal } from "@/src/components/institution-settings/setting-containers/insti-settings-groups/group-modal/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export function Trigger() {
  const { openGroupCreation } = useUserGroupModal();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem onClick={() => openGroupCreation()}>
      <Users2Icon className="h-4 w-4" />
      <span>{t("organization_settings.user_management.trigger.group")}</span>
    </DropdownMenuItem>
  );
}
