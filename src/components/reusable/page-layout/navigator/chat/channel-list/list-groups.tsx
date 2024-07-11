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

const ChannelListGroups = () => {
  const [userId, currentInstitutionId] = useUser((state) => [
    state.user.id,
    state.user.currentInstitutionId,
  ]);

  const filters: ChannelFilters<StreamChatGenerics> = useMemo(() => {
    return {
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      joined: true,
      member_count: {
        $gte: 2,
      },
      members: {
        $in: [userId],
      },
      type: {
        $in: ["messaging"],
      },
      ...(currentInstitutionId
        ? { team: { $in: [currentInstitutionId] } }
        : {}),
      $or: [
        // TODO: Temporary, remove in future
        { isGroupChat: { $eq: undefined as any } },
        { isGroupChat: { $eq: true } },
      ],
    };
  }, [userId, currentInstitutionId]);

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
        <RenderList preview={p} title="chat.messages_titles_group" />
      )}
    />
  );
};

export default ChannelListGroups;
