import React, { useEffect, useMemo, useState } from "react";
import type { Channel, UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import useOpenChatWithUser from "../hooks/useOpenChatWithUser";
import OnlineIndicator from "../online-indicator";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";

type Props = {
  user: UserResponse<StreamChatGenerics>;
};

/**
 * This component resembles list-item-preview component,
 * and renders the individual user-items returned by a user-search query
 */

export default function UserSearchItem({ user }: Props) {
  const { openChatWithUser } = useOpenChatWithUser();
  const { client } = useChatContext<StreamChatGenerics>();
  const { user: authUser } = useUser();
  const [userChannel, setUserChannel] = useState<Channel<StreamChatGenerics>>();
  const { setIsSearching } = useChat();

  useEffect(() => {
    /**
     * check if the user's channel already exists in local state,
     * so we can load and show things like last message etc..
     */
    const uChannel = client.getChannelByMembers("messaging", {
      members: [user.id, authUser.id],
    });

    if (uChannel.id) setUserChannel(uChannel);
  }, []);

  const lastMsg = useMemo(() => {
    const lastMessage = userChannel?.lastMessage();
    const lastMessageText = lastMessage?.text;

    if (lastMessage && lastMessageText) {
      const tempElem = document.createElement("span");
      tempElem.innerHTML = lastMessageText;

      const text = `${
        lastMessage?.user?.id === authUser.id
          ? "You:"
          : `${lastMessage?.user?.name?.trim().split(" ")[0]}:`
      } ${tempElem.innerText.trim() || "(Attachment)"}`;

      tempElem.remove();
      return truncate(text.trim(), 23);
    }
  }, [userChannel]);

  return (
    <div
      onClick={() => {
        openChatWithUser(user.id);
        setIsSearching(false);
      }}
      className={classNames(
        "mb-1 flex min-h-[42px] cursor-pointer items-center justify-between  rounded-md px-1 py-2 hover:bg-accent",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="relative mr-2 min-h-[2rem] min-w-[2rem]">
          <UserDefaultImage
            user={{
              image: user.image,
              id: user.id,
            }}
            dimensions="w-[2rem] h-[2rem]"
          />
          {!!user.online && <OnlineIndicator />}
        </div>
        <div className="group flex min-h-[2rem] grow items-center space-x-2">
          <div className="flex grow justify-between text-xs">
            <div className="flex w-[76%] flex-col text-left">
              <span className={classNames("text-contrast")}>
                {user.name ?? user.id}
              </span>
              <span className="text-muted-contrast">
                {lastMsg ?? user.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
