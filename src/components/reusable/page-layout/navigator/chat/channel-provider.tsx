import React from "react";
import { Channel, useChatContext } from "stream-chat-react";
import { useDragAndDropHandlers } from "../../../simple-file-upload/useFileDragAndDropHandlers";
import NoChannelSelected from "./channel-empty/no-channel-selected";
import NoMessagesInChannel from "./channel-empty/no-messages-in-channel";
import ChannelLoadingErrorIndicator from "./channel-loading-error-indicator";
import MessageSystem from "./message/message-system";
import DragAndDropProvider from "./text-input/drag-and-drop-provider";

/**
 * The reusable channel provider,
 * we use this for both regular chat and course
 * chat/lobby
 */
const ChannelProvider = ({ children }) => {
  const { client } = useChatContext("ChannelProvider");
  const { dragActive, onDragEnter, onDragLeave, onDrop } =
    useDragAndDropHandlers();

  if (!client) return null;
  return (
    <Channel
      EmptyStateIndicator={NoMessagesInChannel}
      MessageSystem={MessageSystem}
      EmptyPlaceholder={<NoChannelSelected />}
      LoadingErrorIndicator={ChannelLoadingErrorIndicator}
      // We use our own typing indicator component instead
      TypingIndicator={() => null}
    >
      <DragAndDropProvider
        dragActive={dragActive}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {children}
      </DragAndDropProvider>
    </Channel>
  );
};

export default ChannelProvider;
