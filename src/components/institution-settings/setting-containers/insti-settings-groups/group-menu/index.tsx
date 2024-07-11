import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { UserGroup } from "..";
import GroupCreateGroupsChat from "./create-group-chat";
import GroupEdit from "./edit";
import GroupManageUsers from "./manage-user";
import GroupRemoveFromInstitution from "./remove";

export default function GroupMenu({ group }: { group: UserGroup }) {
  const [groupChatButtonLabel, setGroupChatButtonLabel] = useState<
    "create" | "open"
  >("create");

  const { client } = useChatContext<StreamChatGenerics>();

  useEffect(() => {
    client
      .queryChannels({ cid: `messaging:${group.id}`, isGroupChat: true })
      .then((ch) => {
        if (!!ch.length) setGroupChatButtonLabel("open");
      });
  }, [group]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          className="cursor-pointer text-muted-contrast hover:opacity-70"
          size={18}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mr-5 w-[200px] opacity-100 !shadow-none focus:outline-none"
      >
        <DropdownMenuGroup className="[&_div]:cursor-pointer">
          <GroupManageUsers group={group} />
          {!!group.members && (
            <GroupCreateGroupsChat label={groupChatButtonLabel} group={group} />
          )}
          <GroupEdit group={group} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <GroupRemoveFromInstitution id={group.id} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
