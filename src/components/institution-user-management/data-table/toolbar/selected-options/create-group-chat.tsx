import { MessageSquarePlusIcon } from "lucide-react";
import React from "react";
import { useCreateGroupChat } from "@/src/client-functions/client-chat/useCreateGroupChat";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import { useSelectMenuUserFilter } from "../../../select-menu/zustand";
import { useInstitutionUserManagement } from "../../../zustand";

export function CreateGroupChat() {
  const userId = useUser((state) => state.user.id);
  const selectedUserIds = useSelectMenuUserFilter(
    (state) => state.filteredUserIds,
  );

  const table = useInstitutionUserManagement((state) => state.table);
  const rows =
    table?.getRowModel().rows.map((row) => row.original as any) ?? [];

  const selectedUsers = rows
    .filter((row) => row.id === selectedUserIds.find((id) => id === row.id))
    .map((row) => ({ email: row.email, id: row.id }))
    .filter((u) => u.id !== userId);

  const { createGroupChatWith } = useCreateGroupChat(false);
  const { openChatWithUser } = useOpenChatWithUser();

  return (
    <WithToolTip delay={300} text="create-group-chat">
      <Button
        variant="ghost"
        onClick={() => {
          if (selectedUsers.length === 1 && selectedUsers[0]?.id) {
            openChatWithUser(selectedUsers[0].id);
          } else if (selectedUsers.length > 1) {
            createGroupChatWith(selectedUsers).catch(log.error);
          }
        }}
      >
        <MessageSquarePlusIcon className="h-4 w-4" />
      </Button>
    </WithToolTip>
  );
}
