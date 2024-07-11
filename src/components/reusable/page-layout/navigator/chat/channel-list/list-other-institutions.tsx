import React, { useMemo } from "react";
import type { ChannelFilters } from "stream-chat";
import { ChannelList as ChannelList_, useChatContext } from "stream-chat-react";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../types";
import ListEmpty from "./list-empty";
import ChannelItemPreview from "./list-item-preview";
import ChannelListPaginator from "./list-paginator";
import ChannelListPlaceholder from "./list-placeholder";
import RenderList from "./render-list";

/** @deprecated only show list of chats from current institution */
export default function ChannelListOtherInstitutions() {
  const { user } = useUser();
  const { client } = useChatContext<StreamChatGenerics>();
  const otherInstitutions =
    client.user?.teams?.filter((id) => id !== user.currentInstitutionId) ?? [];

  const filters: ChannelFilters<StreamChatGenerics> = useMemo(() => {
    return {
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      joined: true,
      members: {
        $in: [user.id],
      },
      member_count: {
        $gte: 2,
      },
      type: {
        $in: ["messaging", "course"],
      },
      ...(user.currentInstitutionId && !!otherInstitutions.length
        ? { team: { $in: otherInstitutions } }
        : {}),
    };
  }, [user]);

  return (
    <ChannelList_<StreamChatGenerics>
      EmptyStateIndicator={ListEmpty}
      filters={filters}
      LoadingIndicator={ChannelListPlaceholder}
      options={{ limit: 100, state: true, watch: true }}
      sort={{ team: 1 }}
      Paginator={ChannelListPaginator}
      Preview={ChannelItemPreview}
      renderChannels={(_c, p) => (
        <RenderList
          preview={p}
          title="chat.channel.list.filters.other_organizations"
        />
      )}
    />
  );
}
