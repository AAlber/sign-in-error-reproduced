import * as DOMPurify from "dompurify";
import { EyeOff } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Channel } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import {
  createChannelNameFromGroup,
  normalizeChatDateUi,
  useGetOtherMembersOfChannel,
} from "@/src/client-functions/client-chat";
import { useUserInstitutions } from "@/src/client-functions/client-chat/useGetInstitutionsOfUser";
import classNames, {
  capitalizeEveryWordFromString,
  truncate,
} from "@/src/client-functions/client-utils";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import ChannelEmoji from "../channel-list/channel-emoji";
import OnlineIndicator from "../online-indicator";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";

type Props = {
  channel: Channel<StreamChatGenerics>;
};

/**
 * This component resembles list-item-preview component,
 * and renders the individual channel items returned by a channel-search query
 */

export default function ChannelSearchItem({ channel }: Props) {
  const { t } = useTranslation("page");
  const { setActiveChannel } = useChatContext<StreamChatGenerics>();
  const { setIsSearching } = useChat();
  const { getOtherMembers } = useGetOtherMembersOfChannel();
  const { userInstitutions } = useUserInstitutions();
  const { user } = useUser();
  const sanitizer = DOMPurify.sanitize;
  const handleSetActiveChannel = () => {
    setActiveChannel(channel);
    setIsSearching(false);
  };

  const userId = user.id;
  const otherMember = getOtherMembers(channel)[0];

  const data = channel.data;
  const institutionName = data?.institution_name;
  const isGroupMessaging = !!data?.isGroupChat;
  const channelInstitutionId = data?.team;
  const channelName = data?.name ?? "";
  const isCourse = channel.type === "course";
  const lastMessage = channel.lastMessage();

  const channelOfAnotherInstitution =
    user.currentInstitutionId !== channelInstitutionId && isCourse;

  const lastMessageAt = normalizeChatDateUi(
    lastMessage?.updated_at,
    false,
    "ddd",
  );

  const title = truncate(
    capitalizeEveryWordFromString(
      channelName === "unnamed_group"
        ? createChannelNameFromGroup(channel.state.members, 2)
        : channelName,
    ),
    24,
  );

  const lastMsg = useMemo(() => {
    const lastMessageText = lastMessage?.text ?? "";
    const tempElem = document.createElement("span");
    tempElem.innerHTML = lastMessageText;
    const isGroup = channel.data?.isGroupChat || channel.type === "course";

    const text = `${
      lastMessage?.user?.id === userId
        ? "You:"
        : isGroup
        ? `${lastMessage?.user?.name?.trim().split(" ")[0]}:`
        : ""
    } ${tempElem.innerText.trim() || "(Attachment)"}`;

    tempElem.remove();
    if (channelOfAnotherInstitution && institutionName)
      return truncate(institutionName, 23);

    return truncate(text.trim(), 23);
  }, [lastMessage]);

  return (
    <div
      onClick={handleSetActiveChannel}
      className={classNames(
        "mb-1 flex min-h-[42px] cursor-pointer items-center justify-between  rounded-md px-1 py-2 hover:bg-accent",
        !!channel.data?.hidden && "opacity-50",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="relative mr-2 min-h-[2rem] min-w-[2rem]">
          {isGroupMessaging || isCourse ? (
            <ChannelEmoji image={data?.image} mode="list" />
          ) : (
            <>
              <UserDefaultImage
                user={{
                  image: otherMember?.user?.image,
                  id: otherMember?.user?.id,
                }}
                dimensions="w-[2rem] h-[2rem]"
              />
              {!!otherMember?.user?.online && !isGroupMessaging && (
                <OnlineIndicator />
              )}
            </>
          )}
        </div>
        <div className="group flex min-h-[2rem] grow items-center space-x-2">
          <div className="flex grow justify-between text-xs">
            <div className="flex w-[76%] flex-col text-left">
              <div className="flex items-center space-x-1">
                <span className=" text-contrast">
                  {title ||
                    otherMember?.user?.name ||
                    `(${t("chat.channel.user.deleted_user")})`}
                </span>
                {!!channel.data?.hidden && <EyeOff size={13} />}
              </div>

              {channel.data?.team &&
              channel.data?.team === user.currentInstitutionId ? (
                <span
                  className="text-xs text-muted-contrast"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(lastMsg),
                  }}
                />
              ) : (
                <span className="text-primary">
                  {channel.data?.team && userInstitutions[channel.data.team]}
                </span>
              )}
            </div>
            <div className="relative flex w-[23%] flex-col items-end space-y-3 text-xs">
              <span className="text-[11px] text-muted-contrast">
                {lastMessageAt}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
