import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import {
  createChannelNameFromGroup,
  useGetOtherMembersOfChannel,
} from "@/src/client-functions/client-chat";
import { generateSystemPermissionMessage as replaceSystemMessageIfAny } from "@/src/client-functions/client-chat/permissions";
import {
  capitalizeEveryWordFromString,
  truncate,
} from "@/src/client-functions/client-utils";
import UserDefaultImage from "@/src/components/user-default-image";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import OnlineIndicator from "../online-indicator";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";
import ChannelEmoji from "./channel-emoji";
import LastMessageTime from "./last-message-time";
import ListItemMenu from "./list-item-menu";

export default function ChannelItemPreview({
  channel,
  setActiveChannel,
  lastMessage,
}: ChannelPreviewUIComponentProps<StreamChatGenerics>) {
  const [showChannel, setShowChannel] = useState(true);
  const { t } = useTranslation("page");
  const { user: user } = useUser();
  const { mutedChannels, setUnseenMessageStart } = useChat();
  const { channel: activeChannel } = useChatContext();
  const { getOtherMembers } = useGetOtherMembersOfChannel();
  const otherMember = getOtherMembers(channel)[0];
  const data = channel.data;
  const unreadCount = channel.countUnread();
  const isChannelMuted = mutedChannels.includes(channel.id ?? "");
  const channelName = data?.name ?? otherMember?.user?.name ?? "";
  const title = truncate(
    capitalizeEveryWordFromString(
      channelName === "unnamed_group"
        ? createChannelNameFromGroup(channel.state.members, 2)
        : channelName,
    ),
    16,
  );

  useEffect(() => {
    setIsUnread(!!unreadCount);
  }, [unreadCount]);
  const [isUnread, setIsUnread] = useState(!!unreadCount);
  const [showMenu, setShowMenu] = useState(false);

  const isStartOfConversation = !channel.lastMessage();
  const isGroupMessaging = channel.data?.isGroupChat ?? channel.id?.[0] !== "!";
  const isCourse = channel.type === "course";
  const institutionName = data?.institution_name;
  const channelInstitutionId = data?.team;
  const channelOfAnotherInstitution =
    user.currentInstitutionId !== channelInstitutionId && isCourse;

  useEffect(() => {
    if (isUnread) {
      const messageSet = channel.state.messageSets[0];
      const messages = messageSet?.messages;
      const unseenMessageStart = messages?.[messages.length - unreadCount];

      if (unseenMessageStart) {
        setUnseenMessageStart({
          channelId: channel.id ?? "",
          messageId: unseenMessageStart.id,
        });
      }
    }
  }, []);

  const handleSetActiveChannel = () => {
    if (channel.id) {
      log.click("Channel Chat Clicked:", channel.id);
      setActiveChannel?.(channel);
      setIsUnread(false);
    }
  };

  const createLastMessage = () => {
    const lastMessageText = lastMessage?.text ?? "";
    const tempElem = document.createElement("span");
    tempElem.innerHTML = lastMessageText;
    let text = `${tempElem.innerText.trim() || "(Attachment)"}`;
    text = t(replaceSystemMessageIfAny(text as any));
    text = isStartOfConversation ? "" : text;

    tempElem.remove();

    if (lastMessage?.type === "deleted") {
      return t("chat.channel.list.message.deleted");
    }

    if (channelOfAnotherInstitution && institutionName) {
      return truncate(institutionName, 40);
    }

    const textWithNewLine = text.replace(/(.{40})/g, "$1\n");
    return truncate(textWithNewLine, 60);
  };

  const lastMsg = createLastMessage();
  const lastMessageUser = lastMessage?.user?.name;
  const isGroup = channel.data?.isGroupChat || channel.type === "course";

  if (!showChannel) return null;
  return (
    <div
      onClick={handleSetActiveChannel}
      onMouseEnter={() => {
        setShowMenu(true);
      }}
      onMouseLeave={() => {
        setShowMenu(false);
      }}
      className={clsx(
        "group mb-2 flex cursor-pointer flex-row items-start justify-between gap-2 rounded-md border border-border p-3.5 transition-all hover:bg-accent/40",
        channel.cid === activeChannel?.cid &&
          "border-muted-contrast  bg-muted/25 ",
      )}
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="flex shrink-0 items-center justify-between">
          {isGroupMessaging || isCourse ? (
            <ChannelEmoji image={data?.image} mode="list" />
          ) : (
            <div className="relative shrink-0">
              <UserDefaultImage
                user={{
                  image: otherMember?.user?.image,
                  id: otherMember?.user?.id,
                }}
                dimensions="w-8 h-8"
              />
              <div className="absolute -right-0.5 scale-75">
                {!!otherMember?.user?.online && !isGroupMessaging && (
                  <OnlineIndicator />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex w-full grow justify-end">
            <div className="flex w-full items-center justify-between">
              <span className={clsx("text-sm font-normal text-contrast")}>
                {title || `(${t("chat.channel.user.deleted_user")})`}
              </span>
              {isUnread && !isChannelMuted && (
                <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </div>
            <div className="flex shrink-0 items-center justify-end">
              {showMenu && !isCourse ? (
                <ListItemMenu
                  channel={channel}
                  isUnread={isUnread}
                  setIsUnread={setIsUnread}
                  onUnhide={() => setShowChannel(false)}
                />
              ) : (
                <LastMessageTime
                  lastMessage={lastMessage}
                  isUnread={isUnread}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-px">
            {isGroup && (
              <p className="text-start text-xs font-semibold">
                {lastMessage?.user?.name?.trim() === user.name ||
                isStartOfConversation
                  ? ""
                  : `${
                      lastMessage?.user?.name?.trim().split(" ")[0] ??
                      "System Message"
                    }`}
              </p>
            )}
            <div className="text-start text-xs text-muted-contrast">
              {lastMsg}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
