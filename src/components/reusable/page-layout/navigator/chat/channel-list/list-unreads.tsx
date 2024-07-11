import React, { useMemo } from "react";
import type { ChannelFilters } from "stream-chat";
import { ChannelList as ChannelList_ } from "stream-chat-react";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../types";
import ChannelItemPreview from "./list-item-preview";
import ChannelListPaginator from "./list-paginator";
import ChannelListPlaceholder from "./list-placeholder";
import RenderList from "./render-list";

const ChannelListUnreads = () => {
  const { user: user } = useUser();

  const filters: ChannelFilters<StreamChatGenerics> = useMemo(() => {
    return {
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      members: {
        $in: [user.id],
      },
      team: { $eq: user.currentInstitutionId },
      joined: true,
    };
  }, [user]);

  return (
    <ChannelList_<StreamChatGenerics>
      EmptyStateIndicator={() => null}
      filters={filters}
      options={{ limit: 100, offset: 0 }}
      LoadingIndicator={ChannelListPlaceholder}
      Paginator={ChannelListPaginator}
      Preview={ChannelItemPreview}
      sendChannelsToList
      channelRenderFilterFn={(p) => {
        return p.filter((i) => !!i.countUnread());
      }}
      renderChannels={(_c, p) => (
        <RenderList preview={p} title="chat.messages_titles_unread" />
      )}
    />
  );
};

export default ChannelListUnreads;
