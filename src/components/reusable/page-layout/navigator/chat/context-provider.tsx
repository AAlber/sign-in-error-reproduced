import React, { useEffect, useState } from "react";
import type { Channel } from "stream-chat";
import { Chat as StreamChat, useChatContext } from "stream-chat-react";
import { useGetUnreadCountFromChannelsOfCurrentInstitution } from "@/src/client-functions/client-chat/useGetUnreadCountFromChannelsOfCurrentInstitution";
import useListenNewMessages from "@/src/client-functions/client-chat/useListenNewMessages";
import { filterUndefined } from "@/src/utils/utils";
import { useStreamChatContext } from "../../../../getstream";
import useGetActiveMembers from "./hooks/useGetActiveMembers";
import type { StreamChatGenerics } from "./types";
import useChat from "./zustand";

const Chat = ({ children }) => {
  const { client } = useStreamChatContext();
  const [audio] = useState(new Audio("/notif_sound.mp3"));

  if (!client) {
    /**
     * If user is not yet connected to getstream, we render the children
     * to avoid blocking the main app, whole app will basically rerender
     * once user is connected to getstream
     */
    return <>{children}</>;
  }

  return (
    <StreamChat<StreamChatGenerics>
      client={client}
      customClasses={{
        channel: "overflow-y-hidden h-full",
        channelList: "",
        chat: "",
        chatContainer: "h-full",
        message: "",
      }}
    >
      <Main audio={audio}>{children}</Main>
    </StreamChat>
  );
};

export default Chat;

const Main = ({
  audio,
  children,
}: {
  children: JSX.Element;
  audio: HTMLAudioElement;
}) => {
  const { client } = useChatContext<StreamChatGenerics>();

  const [setMutedChannels, setUnreadChannels] = useChat((state) => [
    state.setMutedChannels,
    state.setUnreadChannels,
  ]);

  useGetActiveMembers();
  useListenNewMessages(audio);

  const { getUnreadCount } =
    useGetUnreadCountFromChannelsOfCurrentInstitution(client);

  /**
   * On load of app, we update our zustand state of:
   * 1. muted channels
   * 2. how many channels are unread
   */
  useEffect(() => {
    const mutedChannels =
      (client.user?.channel_mutes as { channel: Channel }[])
        .map((i) => i.channel.id)
        .filter(filterUndefined) ?? [];

    getUnreadCount().then(setUnreadChannels);
    setMutedChannels(mutedChannels);
  }, []);

  return children;
};
