import clsx from "clsx";
import { useEffect, useRef, useState, type WheelEventHandler } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageInput,
  MessageList,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import useGetInstitutionsOfUser from "@/src/client-functions/client-chat/useGetInstitutionsOfUser";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import { createMessageListGroupStyles } from "./createMessageListGroupStyles";
import Message from "./message";
import MessageHeader from "./message/message-header";
import TextInput from "./text-input";
import { useChatDragAndDropContext } from "./text-input/drag-and-drop-provider";
import type { StreamChatGenerics } from "./types";
import TypingIndicator from "./typing-indicator";
import useChat from "./zustand";

const ChannelInner = () => {
  const { setCurrentChannel, setUnseenMessageStart } = useChat();
  const { client, setActiveChannel } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const { onDragEnter, onDragLeave } = useChatDragAndDropContext();

  const [isReadonlyMode, setIsReadonlyMode] = useState(
    !!channel.data?.isReadOnlyMode &&
      // only users with a `member` role are affected by readOnlyMode
      !channel.data.own_capabilities?.includes("send-message"),
  );

  const messageListContainer = useRef<HTMLDivElement>(null);

  // fetch user institutions when chat window is mounted
  useGetInstitutionsOfUser();

  // avoid disconnecting from channel due to rerenders
  const isComponentReady = useRef(false);

  useEffect(() => {
    // set Channel value here so ChannelHeader can receive the `Channel` value
    setCurrentChannel(channel);

    const { unsubscribe } = channel.on("channel.updated", async (e) => {
      const { channel: channel_ } = await channel.query({});
      const currentChannelInState = useChat.getState().currentChannel;

      if (channel_.id === currentChannelInState?.id) {
        // instantiate a new getStream Channel class
        const updatedChannel = client.channel(channel_.type, channel_.id, {});
        setCurrentChannel(updatedChannel);
      }

      setIsReadonlyMode(
        !!e.channel?.isReadOnlyMode &&
          !channel_.own_capabilities?.includes("send-message"),
      );
    });

    setTimeout(() => {
      isComponentReady.current = true;
    }, 500);

    return () => {
      unsubscribe();
      if (isComponentReady.current && !channel.lastMessage()) {
        setTimeout(() => {
          // delete orphaned channels
          channel
            .watch()
            .then((c) => {
              if (c.channel.isGroupChat && !c.messages.length) {
                channel.delete().catch(console.log);
                setActiveChannel(undefined);
              }
            })
            .catch(console.log);
        }, 1000);
      } else {
        setUnseenMessageStart({ channelId: channel.id ?? "", messageId: "" });
      }
      setCurrentChannel(undefined);
    };
  }, [channel]);

  /**
   * Propagate scroll event from parent to child so we can
   * scroll the messageList even if the mouse is over the messagelist
   * container, something like what the teams app do
   *  */
  const handleScroll: WheelEventHandler<HTMLDivElement> = (e) => {
    const child =
      messageListContainer.current?.querySelector(".str-chat__list ");
    if (child) child.scrollTop += e.deltaY;
  };

  const isInLobby = pageHandler.get.currentPage().titleKey !== "CHAT";

  return (
    <div
      id="channelInner"
      className="relative flex h-full flex-col"
      onWheel={handleScroll}
      ref={messageListContainer}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div
        className={clsx(
          "container relative grow overflow-y-scroll",
          isInLobby ? "px-2" : "mb-6 grow overflow-y-scroll",
        )}
      >
        <MessageList
          Message={Message}
          disableDateSeparator
          head={<MessageHeader />}
          groupStyles={createMessageListGroupStyles}
        />
      </div>
      <div
        className={clsx(
          "relative mb-0 w-full px-0",
          isInLobby ? "px-2" : "px-4",
        )}
      >
        <TypingIndicator />
        {isReadonlyMode ? (
          <ReadOnlyModeNotice />
        ) : (
          <MessageInput<StreamChatGenerics>
            Input={TextInput}
            /**
             * we do our own implementation of the typing event
             * to make it compatible with the slate component
             */
            publishTypingEvent={false}
          />
        )}
      </div>
    </div>
  );
};

export default ChannelInner;

function ReadOnlyModeNotice() {
  const { t } = useTranslation("page");
  return (
    <div className="border-t border-muted py-4">
      <p className="text-sm text-muted-contrast">
        {t("chat.channel.read_only_mode.notice")}
      </p>
    </div>
  );
}
