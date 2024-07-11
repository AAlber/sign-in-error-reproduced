import { useAuth } from "@clerk/nextjs";
import clsx from "clsx";
import {
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Mail,
  MailCheck,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import React, { type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Channel } from "stream-chat";
import { useGetOtherMembersOfChannel } from "@/src/client-functions/client-chat";
import confirmAction from "@/src/client-functions/client-options-modal";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";

const ListItemMenu = (props: {
  channel: Channel<StreamChatGenerics>;
  isUnread: boolean;
  setIsUnread: React.Dispatch<React.SetStateAction<boolean>>;
  onUnhide: () => void;
}) => {
  const { channel, isUnread, onUnhide, setIsUnread } = props;
  const { getOtherMembers } = useGetOtherMembersOfChannel();
  const { mutedChannels, setMutedChannels, setCurrentChannel, currentChannel } =
    useChat();
  const { t } = useTranslation("page");
  const { userId } = useAuth();

  const lastMessage = channel.lastMessage();
  const isChannelMuted = !!mutedChannels.includes(channel.id ?? "");
  const members = getOtherMembers(channel);

  const handleHideChat =
    (clearHistory = true) =>
    () => {
      channel.hide(userId, clearHistory).catch(console.log);
      if (currentChannel?.id === channel.id) {
        setCurrentChannel(undefined);
      }
    };

  const handleUnHideChat = () => {
    channel.show(userId);
    onUnhide();
  };

  const handleToggleMute = async () => {
    if (!channel.id) return;
    if (isChannelMuted) {
      setMutedChannels(mutedChannels.filter((i) => channel.id !== i));
      await channel.unmute().catch(console.log);
    } else {
      setMutedChannels([...new Set([...mutedChannels, channel.id])]);
      await channel.mute().catch(console.log);
    }
  };

  const handleToggleRead = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (isUnread) {
      channel.markRead().then(console.log).catch(console.log);
      setIsUnread(false);
    } else {
      channel
        .markUnread({ message_id: lastMessage.id, user_id: userId ?? "" })
        .then(console.log)
        .catch(console.log);

      setIsUnread(true);
    }
  };

  const handleDeleteChat = () => {
    confirmAction(handleHideChat(true), {
      actionName: t("Delete"),
      description: replaceVariablesInString(
        t("chat.channel.list.menu.delete_chat.description"),
        members.length > 1
          ? ["the other members of the chat"]
          : [members[0]?.user?.name ?? ""],
      ),
      title: t("chat.channel.list.menu.delete_chat.title"),
      dangerousAction: true,
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "mr-0.5 h-[20px] transition-transform active:scale-90",
          isUnread ? "text-contrast" : "text-muted-contrast",
        )}
      >
        <MoreHorizontal size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" className="!min-w-fit !text-xs">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <button
              className="flex w-full items-center space-x-2 text-left"
              onClick={handleToggleRead}
            >
              {isUnread ? (
                <>
                  <MailCheck size={16} />
                  <span>{t("chat.channel.list.menu.mark_read")}</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>{t("chat.channel.list.menu.mark_unread")}</span>
                </>
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button
              className="flex w-full items-center space-x-2 text-left text-sm"
              onClick={handleToggleMute}
            >
              {!isChannelMuted ? (
                <>
                  <BellOff size={16} />
                  <span>{t("chat.channel.list.menu.mute")}</span>
                </>
              ) : (
                <>
                  <Bell size={16} />
                  <span>{t("chat.channel.list.menu.unmute")}</span>
                </>
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {!!channel.data?.hidden ? (
              <button
                className="flex w-full items-center space-x-2 text-left text-sm"
                onClick={handleUnHideChat}
              >
                <Eye size={16} />
                <span>{t("chat.channel.list.menu.show")}</span>
              </button>
            ) : (
              <button
                className="flex w-full items-center space-x-2 text-left text-sm"
                onClick={handleHideChat(false)}
              >
                <EyeOff size={16} />
                <span>{t("chat.channel.list.menu.hide")}</span>
              </button>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center space-x-2"
            onClick={handleDeleteChat}
          >
            <Trash size={16} />
            <span>{t("chat.channel.list.menu.delete_chat")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListItemMenu;
