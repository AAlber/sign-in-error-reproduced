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

const ChannelListDefault = () => {
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
      members: {
        $in: [userId],
      },
      $or: [
        {
          type: "course",
          ...(currentInstitutionId ? { team: currentInstitutionId } : {}),
        },
        { type: "messaging" },
      ],
    };
  }, [userId, currentInstitutionId]);

  return (
    <ChannelList_<StreamChatGenerics>
      EmptyStateIndicator={ListEmpty}
      filters={filters}
      allowNewMessagesFromUnfilteredChannels={false}
      LoadingIndicator={ChannelListPlaceholder}
      options={{ limit: 100, state: true, watch: true }}
      Paginator={ChannelListPaginator}
      Preview={ChannelItemPreview}
      setActiveChannelOnMount={false}
      renderChannels={(_c, p) => <RenderList preview={p} title="" />}
      channelRenderFilterFn={(channels) =>
        channels.filter((ch) => !!ch.lastMessage())
      }
    />
  );
};

export default ChannelListDefault;
