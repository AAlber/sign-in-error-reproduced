import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useChatContext } from "stream-chat-react";
import classNames from "@/src/client-functions/client-utils";
import ChannelSearch, { queryChannels } from "../channel-search";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";
import ChannelListCourse from "./list-course";
import ChannelListDefault from "./list-default";
import ChannelListGroups from "./list-groups";
import ChannelListHidden from "./list-hidden";
import ChannelListMessaging from "./list-messaging";
import ToolBar from "./toolbar";
import useChannelList from "./zustand";

const ChannelList = () => {
  const { listToRender } = useChannelList();
  const { client } = useChatContext<StreamChatGenerics>();

  const isSearching = useChat((state) => state.isSearching);

  /**
   * just simply make a fetch, so that when we open channel search
   * we show cached results immediately and avoid the initial loading
   * for a smooth transition to channel search
   */
  useQuery({
    queryKey: ["getstream", "channel-search", ""],
    queryFn: client ? () => queryChannels(client) : () => Promise.resolve([]),
    staleTime: 60000 * 5,
  });

  const renderList = () => {
    switch (listToRender) {
      case "messaging": {
        return <ChannelListMessaging />;
      }
      case "groups": {
        return <ChannelListGroups />;
      }
      case "course": {
        return <ChannelListCourse />;
      }
      case "hidden": {
        return <ChannelListHidden />;
      }
      default: {
        return <ChannelListDefault />;
      }
    }
  };

  if (!client) return null;
  return (
    <div className="h-full w-full">
      <ToolBar />
      <div className="flex flex-col">
        {isSearching && <ChannelSearch />}
        <div className={classNames("grow", isSearching && "hidden")}>
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default ChannelList;
