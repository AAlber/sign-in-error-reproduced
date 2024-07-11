import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import type { Channel, EventHandler } from "stream-chat";
import { useStreamChatContext } from "@/src/components/getstream";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import useCourse from "../zustand";

type SubscribeType = ReturnType<Channel<StreamChatGenerics>["on"]>;
const useGetLobbyUnreadMessages = (props: {
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { client } = useStreamChatContext();
  const { course } = useCourse();
  const { setUnseenMessageStart } = useChat();
  const { setUnreadCount } = props;
  const auth = useAuth();
  const channel = client?.channel("course", course?.layer_id);

  useEffect(() => {
    let eventHandler: SubscribeType | undefined;
    if (!channel || !auth.userId) return;

    const handleNewMessage: EventHandler<StreamChatGenerics> = (e) => {
      if (e.type === "message.new") {
        const unread = channel.countUnread();
        setUnreadCount(unread);
      }
    };

    async function init() {
      if (!channel) return;
      await channel?.query({});
      const unreadCount = channel.countUnread();
      setUnreadCount(unreadCount);

      if (!!unreadCount) {
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

      try {
        const { membership } = await channel.watch({
          watch: true,
          state: true,
        });

        /**
         * Add user to the course chat channel the first time the user opens
         * the lobby
         */
        if (!membership) {
          await channel.addMembers([auth.userId as string]);
        }

        eventHandler = channel.on("message.new", handleNewMessage);
      } catch (e) {
        console.log(e);
      }
    }

    init();

    return () => {
      eventHandler?.unsubscribe();
    };
  }, [channel]);
  return null;
};

export default useGetLobbyUnreadMessages;
