import React from "react";
import { useTranslation } from "react-i18next";
import { useChannelStateContext } from "stream-chat-react";
import {
  createChannelNameFromGroup,
  useGetOtherMembersOfChannel,
} from "@/src/client-functions/client-chat";
import {
  capitalizeEveryWordFromString,
  replaceVariablesInString,
  truncate,
} from "@/src/client-functions/client-utils";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import UserDefaultImage from "@/src/components/user-default-image";
import ChannelEmoji from "../channel-list/channel-emoji";
import type { StreamChatGenerics } from "../types";

const MessageHeader = () => {
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const { t } = useTranslation("page");
  const { getOtherMembers } = useGetOtherMembersOfChannel();

  const members = channel.state.members;
  const isGroupChat = channel.data?.isGroupChat;

  const isDefaultGroupChatname =
    isGroupChat && channel.data?.name === "unnamed_group";

  const data = channel.data;
  const otherMember = getOtherMembers(channel)[0];

  const channelName = data?.name ?? otherMember?.user?.name ?? "";

  const text = isDefaultGroupChatname
    ? replaceVariablesInString(t("chat.messages_header_text3"), [
        channelName ?? "",
      ])
    : `${t("chat.messages_header_text1")} ${channelName ?? ""} ${t(
        "chat.messages_header_text2",
      )}`;

  const isGroupMessaging = channel.data?.isGroupChat ?? channel.id?.[0] !== "!";
  const isCourse = channel.type === "course";

  const title = truncate(
    capitalizeEveryWordFromString(
      channelName === "unnamed_group"
        ? createChannelNameFromGroup(channel.state.members, 2)
        : channelName,
    ),
    24,
  );

  if (!channel.data) return null;

  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2">
      <div className="h-14 w-14 rounded-full">
        {isGroupMessaging || isCourse ? (
          <ChannelEmoji
            image={data?.image}
            mode="start-chat"
            border={!isCourse}
          />
        ) : (
          <>
            <UserDefaultImage
              user={{
                image: otherMember?.user?.image,
                id: otherMember?.user?.id,
              }}
              dimensions="w-14 h-14"
            />
          </>
        )}
      </div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-contrast">{t("chat_beginning")}</p>
      <Separator className="mt-4" />
    </div>
  );
};

export default MessageHeader;
