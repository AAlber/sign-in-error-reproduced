import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Channel } from "stream-chat";
import { useChannelListContext } from "stream-chat-react";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";
import useChannelList from "./zustand";

/**
 * NOTE:
 * using channels from channelListContext context here instead of from
 * props so we can have control over which channels are loaded into state
 */

interface Props {
  title: string;
  showBorder?: boolean;
  preview: (channel: Channel<StreamChatGenerics>) => React.ReactNode;
}

const RenderChannel: React.FC<Props> = (props) => {
  const { t } = useTranslation("page");
  const { preview, title } = props;
  const { listToRender } = useChannelList();
  const { channels, setChannels } = useChannelListContext<StreamChatGenerics>();
  const { currentChannel, refresh } = useChat();

  const [showList, setShowList] = useState(true);

  useEffect(() => {
    const isNewChannel =
      !!currentChannel && channels.every((ch) => ch.id !== currentChannel?.id);

    if (isNewChannel && !!refresh)
      setChannels((prev) => [currentChannel, ...prev]);
  }, [currentChannel, refresh]);

  const handleClickTitle = () => {
    setShowList(!showList);
  };

  return (
    <>
      <p
        className={clsx(
          "mb-2 flex cursor-pointer border-b !bg-transparent px-0 py-2 text-sm font-semibold transition-opacity",
          showList && "border-border",
          typeof listToRender === "undefined" && "hidden",
        )}
        onClick={handleClickTitle}
      >
        {t(title)}
      </p>
      <div
        className={clsx(
          "overflow-y-scroll pb-12 transition-all",
          showList ? "max-h-[92vh]" : "max-h-0",
        )}
      >
        {channels.map((i) => (
          <React.Fragment key={i.id}>{preview(i)}</React.Fragment>
        ))}
      </div>
    </>
  );
};

export default RenderChannel;
