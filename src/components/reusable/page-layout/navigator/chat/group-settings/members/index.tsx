import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon, User, UserPlus, X } from "lucide-react";
import { type SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatContext } from "stream-chat-react";
import { reduceNamesFromUsersArray } from "@/src/client-functions/client-chat";
import confirmAction from "@/src/client-functions/client-options-modal";
import { getUsersOfAllInstitutions } from "@/src/client-functions/client-user";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { toast } from "@/src/components/reusable/toaster/toast";
import UserSearchSelectModal from "@/src/components/reusable/user-search-select-modal";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import { useChannelHeaderContext } from "../../channel-header";
import useOpenChatWithUser from "../../hooks/useOpenChatWithUser";
import type { StreamChatGenerics } from "../../types";

const GroupMemberSettings = () => {
  const { channel } = useChannelHeaderContext();
  const { client } = useChatContext<StreamChatGenerics>();
  const { user } = useUser();
  const { openChatWithUser } = useOpenChatWithUser();
  const { setActiveChannel } = useChatContext<StreamChatGenerics>();
  const { t } = useTranslation("page");
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);

  const capabilities = channel?.data?.own_capabilities;
  const canUpdateChannel = !!capabilities?.includes("update-channel");
  const canUpdateChannelMembers = !!capabilities?.includes(
    "update-channel-members",
  );

  const memberCount = channel.data?.member_count;
  const members = channel.state.members;
  const channelMemberIds = Object.keys(members);
  const channelMembers = channelMemberIds.map((member) => members[member]);
  const isCourse = channel.type === "course";
  const canDeleteChannel =
    channel.type !== "course" && capabilities?.includes("delete-channel");

  const handleChatWithUser =
    (memberId: string) => async (e: SyntheticEvent) => {
      e.stopPropagation();
      if (memberId === user.id) return;
      await openChatWithUser(memberId);
    };

  const handleRemove = (id: string, name: string) => async () => {
    try {
      await channel.removeMembers([id], {
        systemMessageType: "channel.member.remove",
        type: "system",
        text: name,
      });
      queryClient.clear();
    } catch (e) {
      console.log(e); // TODO: toast error
    }
  };

  const handleDelete = async () => {
    await channel.delete().catch(console.log);
  };

  const handleLeaveGroup = async () => {
    try {
      await channel.removeMembers(
        [user.id],
        {
          systemMessageType: "channel.member.remove",
          type: "system",
          text: user.name,
        },
        {
          hide_history: true,
        },
      );
      setActiveChannel(undefined);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const addSelectedToChat = async (selectedUsers: SimpleUser[]) => {
    /**
     * we have to query the selected users' institution from getstream, verify
     * that they are registered on getstream, and that they are a member of currentInstitution
     * else we cannot add them into the group chat due to getstream restrictions
     */

    const joinedUsers: SimpleUser[] = [];
    const unjoinedUsers: SimpleUser[] = [];

    try {
      const { users: streamUsers } = await client.queryUsers({
        id: { $in: selectedUsers.map((u) => u.id) },
      });

      streamUsers.forEach((u) => {
        const obj = {
          id: u.id,
          name: u.name ?? "",
          email: u.email ?? "",
          image: u.image ?? null,
        };

        !!u.teams?.includes(user.currentInstitutionId)
          ? joinedUsers.push(obj)
          : unjoinedUsers.push(obj);
      });

      const streamUserIds = streamUsers.map((u) => u.id);
      const unregisteredUsers = selectedUsers.filter(
        (u) => !streamUserIds.includes(u.id),
      );

      unregisteredUsers.forEach((u) => {
        unjoinedUsers.push(u);
      });

      const joinedUsersIds = joinedUsers.map((u) => u.id);
      const joinedUsersNames = reduceNamesFromUsersArray(joinedUsers);
      const unjoinedUsersNames = reduceNamesFromUsersArray(unjoinedUsers);

      if (unjoinedUsers.length) {
        /**
         * for unjoined users, just show a warning to invite them to institution first,
         * while add the joined users into the group chat
         */
        toast.warning("chat.group_settings.members.add_people.warning.title", {
          description: t(
            "chat.group_settings.members.add_people.warning.description",
            {
              users: unjoinedUsersNames,
            },
          ),
          duration: 5000,
        });
      }

      await channel.addMembers(joinedUsersIds, {
        systemMessageType: "channel.member.new",
        type: "system",
        text: joinedUsersNames,
      });
      queryClient.clear();
    } catch (e) {
      console.log(e);
    }
  };

  const handleAction = (action: "leave" | "delete") => () => {
    const isLeaveAction = action === "leave";
    const title = isLeaveAction
      ? t("chat.group_settings.leave.alert_title")
      : t("chat.group_settings.delete.alert_title");

    const description = isLeaveAction
      ? t("chat.group_settings.leave.alert_description")
      : t("chat.group_settings.delete.alert_description");

    const buttonConfirmationMessage = isLeaveAction
      ? t("chat.group_settings.leave")
      : t("chat.channel.list.menu.delete_chat");

    const runAction = isLeaveAction ? handleLeaveGroup : handleDelete;

    confirmAction(
      () => {
        runAction();
      },
      {
        actionName: buttonConfirmationMessage,
        title,
        description,
        dangerousAction: true,
      },
    );
  };
  const isOwner = members[user.id]?.role === "owner";

  return (
    <DropdownMenu
      modal={false}
      open={modalOpen}
      onOpenChange={(state) => {
        setModalOpen(state);
      }}
    >
      {channel.type !== "course" && (
        <DropdownMenuTrigger
          className="flex space-x-1 text-contrast hover:text-accent-contrast"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {canUpdateChannelMembers ? (
            <Button variant={"ghost"}>{<UserPlus className="size-4" />}</Button>
          ) : (
            <Button variant={"ghost"}> {<User className="size-4" />} </Button>
          )}
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent className="min-w-[260px]">
        <span className="px-2 text-xs">
          {replaceVariablesInString(t("chat.group_settings.members_in_chat"), [
            String(memberCount),
          ])}
        </span>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[200px] overflow-y-scroll">
          {channelMembers.map((member) => {
            if (!member || !member.user?.id) return null;
            const memberId = member.user?.id;
            const channelRole = member.role ?? "";

            return (
              <DropdownMenuItem
                key={memberId}
                className="group flex justify-between"
              >
                <button
                  className="flex space-x-2"
                  onClick={handleChatWithUser(memberId)}
                >
                  <UserDefaultImage
                    user={{
                      id: memberId,
                      image: member?.user?.image ?? "",
                    }}
                    dimensions="h-[1.6rem] w-[1.6rem]"
                  />
                  <span className="">{member?.user?.name}</span>
                </button>
                {!isCourse &&
                  canUpdateChannelMembers &&
                  memberId !== user.id &&
                  channelRole !== "owner" && (
                    <button
                      onClick={handleRemove(
                        memberId,
                        member.user.name ?? member.user.email ?? memberId,
                      )}
                      className="hidden text-muted-contrast group-hover:block"
                    >
                      <X size={18} />
                    </button>
                  )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {channel.type !== "course" && <DropdownMenuSeparator />}
        <DropdownMenuGroup>
          {!isCourse &&
            canUpdateChannelMembers &&
            canUpdateChannel &&
            isOwner && (
              <DropdownMenuItem asChild onClick={(e) => e.preventDefault()}>
                <UserSearchSelectModal
                  onConfirm={addSelectedToChat}
                  localFilterUserIds={channelMemberIds}
                  confirmLabel={t("general.confirm")}
                  title={t("chat.group_settings.members.add_people")}
                  customFetcher={(q) =>
                    getUsersOfAllInstitutions(q, channelMemberIds)
                  }
                  subtitle={t(
                    "chat.group_settings.members.add_people.modal.subtitle",
                  )}
                >
                  <div className="flex w-full space-x-4 p-2 text-sm transition-colors hover:bg-accent/50">
                    <User size={20} />
                    <span>{t("chat.group_settings.members.add_people")}</span>
                  </div>
                </UserSearchSelectModal>
              </DropdownMenuItem>
            )}
          {!isCourse && (
            <DropdownMenuItem onClick={handleLeaveGroup} className="space-x-2">
              <LogOutIcon size={18} />
              <span>{t("chat.group_settings.leave")}</span>
            </DropdownMenuItem>
          )}
          {canDeleteChannel && (
            <DropdownMenuItem
              className="space-x-2"
              onClick={handleAction("delete")}
            >
              <X size={20} />
              <span>{t("chat.group_settings.delete")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupMemberSettings;
