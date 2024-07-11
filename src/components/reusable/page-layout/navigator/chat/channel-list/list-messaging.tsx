import React, { useMemo } from "react";
import type { ChannelFilters } from "stream-chat";
import { ChannelList as ChannelList_ } from "stream-chat-react";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../types";
import ListEmpty from "./list-empty";
import ChannelItemPreview from "./list-item-preview";
import ChannelListPaginator from "./list-paginator";
import ChannelListPlaceholder from "./list-placeholder";
import RenderList from "./render-list";

const ChannelListMessaging = () => {
  const { user: user } = useUser();

  const filters: ChannelFilters<StreamChatGenerics> = useMemo(() => {
    return {
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      joined: true,
      member_count: 2,
      members: {
        $in: [user.id],
      },
      type: {
        $in: ["messaging"],
      },
      $or: [
        { isGroupChat: { $exists: false } },
        { isGroupChat: { $eq: false } },
      ],
    };
  }, [user]);

  return (
    <ChannelList_<StreamChatGenerics>
      allowNewMessagesFromUnfilteredChannels={false}
      EmptyStateIndicator={ListEmpty}
      filters={filters}
      LoadingIndicator={ChannelListPlaceholder}
      options={{ limit: 10 }}
      Paginator={ChannelListPaginator}
      Preview={ChannelItemPreview}
      sendChannelsToList
      renderChannels={(_c, p) => (
        <RenderList preview={p} title="chat.messages_titles_direct" />
      )}
    />
  );
};

export default ChannelListMessaging;
