import type { ExtendableGenerics } from "stream-chat";
import type { GroupStyle, StreamMessage } from "stream-chat-react";
import { CUSTOM_MESSAGE_TYPE } from "./message";
import type { StreamChatGenerics } from "./types";

/**
 * This function is passed into the `groupStyles` props of the `messageList` component
 * which creates the logic on how to render `bubbles` UI.
 *
 * Customized version of:
 * https://github.com/GetStream/stream-chat-react/blob/e08d972ebbadf460f021b031bd34bd44e31faa16/src/components/MessageList/utils.ts#L263-L311
 */
export const createMessageListGroupStyles = <
  T extends ExtendableGenerics = StreamChatGenerics,
>(
  message: StreamMessage<T>,
  previousMessage: StreamMessage<T>,
  nextMessage: StreamMessage<T>,
  noGroupByUser: boolean,
): GroupStyle => {
  if (message.customType === CUSTOM_MESSAGE_TYPE.date) return "";
  if (message.customType === CUSTOM_MESSAGE_TYPE.intro) return "";
  if (noGroupByUser || message.attachments?.length !== 0) return "single";

  const isTopMessage =
    !previousMessage ||
    previousMessage.customType === CUSTOM_MESSAGE_TYPE.intro ||
    previousMessage.customType === CUSTOM_MESSAGE_TYPE.date ||
    previousMessage.type === "system" ||
    previousMessage.attachments?.length !== 0 ||
    message.user?.id !== previousMessage.user?.id ||
    previousMessage.type === "error" ||
    previousMessage.deleted_at ||
    (message.reaction_counts &&
      Object.keys(message.reaction_counts).length > 0);

  const isBottomMessage =
    !nextMessage ||
    nextMessage.customType === CUSTOM_MESSAGE_TYPE.date ||
    nextMessage.type === "system" ||
    nextMessage.customType === CUSTOM_MESSAGE_TYPE.intro ||
    nextMessage.attachments?.length !== 0 ||
    message.user?.id !== nextMessage.user?.id ||
    nextMessage.type === "error" ||
    nextMessage.deleted_at ||
    (nextMessage.reaction_counts &&
      Object.keys(nextMessage.reaction_counts).length > 0);

  if (!isTopMessage && !isBottomMessage) {
    if (message.deleted_at || message.type === "error") return "single";
    return "middle";
  }

  if (isBottomMessage) {
    if (isTopMessage || message.deleted_at || message.type === "error")
      return "single";
    if (nextMessage?.deleted_at) return "middle";
    return "bottom";
  }

  if (isTopMessage) {
    if (!!previousMessage?.deleted_at) return "middle";
    return "top";
  }

  return "";
};
