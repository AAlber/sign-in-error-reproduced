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

const ChannelListHidden = () => {
  const { user } = useUser();

  const filters: ChannelFilters<StreamChatGenerics> = useMemo(() => {
    return {
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      joined: true,
      members: {
        $in: [user.id],
      },
      team: {
        $in: [user.currentInstitutionId],
      },
      hidden: { $eq: true },
    };
  }, [user]);

  return (
    <ChannelList_<StreamChatGenerics>
      allowNewMessagesFromUnfilteredChannels={false}
      EmptyStateIndicator={ListEmpty}
      filters={filters}
      LoadingIndicator={ChannelListPlaceholder}
      options={{ limit: 100 }}
      Paginator={ChannelListPaginator}
      Preview={ChannelItemPreview}
      sendChannelsToList
      renderChannels={(_c, p) => (
        <RenderList preview={p} title="chat.channel.list.filters.hidden" />
      )}
    />
  );
};

export default ChannelListHidden;
