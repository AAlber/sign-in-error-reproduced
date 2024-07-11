import { useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import ChannelInner from "../../reusable/page-layout/navigator/chat/channel-inner";
import ChannelProvider from "../../reusable/page-layout/navigator/chat/channel-provider";
import type { StreamChatGenerics } from "../../reusable/page-layout/navigator/chat/types";
import useCourse from "../zustand";

export default function Lobby() {
  const {
    client,
    setActiveChannel,
    channel: contextChannel,
  } = useChatContext<StreamChatGenerics>();
  const { course } = useCourse();

  useEffect(() => {
    const channel = client.channel("course", course?.layer_id);
    setActiveChannel(channel);
  }, [course?.layer_id]);

  if (!contextChannel) return null;
  return (
    <ChannelProvider>
      <ChannelInner />
    </ChannelProvider>
  );
}
