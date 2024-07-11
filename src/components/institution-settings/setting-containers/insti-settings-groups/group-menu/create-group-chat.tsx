import { MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateGroupChat } from "@/src/client-functions/client-chat/useCreateGroupChat";
import { getUsersOfUserGroups } from "@/src/client-functions/client-institution-user-groups";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { log } from "@/src/utils/logger/logger";
import type { UserGroup } from "../index";

type Props = { label: "create" | "open"; group: UserGroup };

export default function GroupCreateGroupsChat({ group, label }: Props) {
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const { t } = useTranslation("page");

  useEffect(() => {
    async function fetchUsersOfGroup() {
      const result = await getUsersOfUserGroups([group.id]);
      setUsers(result);
    }
    fetchUsersOfGroup().catch(log.error);
  }, []);

  const { createGroupChatWith } = useCreateGroupChat(
    true,
    group.id,
    group.name,
  );

  return (
    <DropdownMenuItem
      className="flex w-full px-2"
      onClick={() => {
        if (!users.length) return;
        createGroupChatWith(users).catch(log.error);
      }}
    >
      <MessagesSquare className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t(label === "create" ? "create-group-chat" : "open-group-chat")}
      </span>
    </DropdownMenuItem>
  );
}
