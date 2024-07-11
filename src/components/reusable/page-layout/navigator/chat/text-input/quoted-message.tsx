import clsx from "clsx";
import * as DOMPurify from "dompurify";
import { X } from "lucide-react";
import React from "react";
import type { MessageResponseBase } from "stream-chat";
import {
  useChannelActionContext,
  useChannelStateContext,
} from "stream-chat-react";
import { normalizeChatDateUi } from "@/src/client-functions/client-chat";
import { useCustomSlateContext } from "@/src/components/slate";
import type { StreamChatGenerics } from "../types";
/**
 * A reusable component which is rendered either inside the chat message
 * or inside the slateInput.
 */
const QuotedMessage = (props: {
  quotedMessage?: MessageResponseBase<StreamChatGenerics>;
}) => {
  const { quotedMessage: quotedMessageProps } = props;
  const { isEditing } = useCustomSlateContext();
  const { quotedMessage } = useChannelStateContext<StreamChatGenerics>();
  const { setQuotedMessage, jumpToMessage } =
    useChannelActionContext<StreamChatGenerics>();
  const sanitizer = DOMPurify.sanitize;
  const handleJump = async () => {
    if (isEditing || !quotedMessageProps) return;
    await jumpToMessage(quotedMessageProps.id);
  };

  const message = quotedMessageProps ?? quotedMessage;
  if (!message || isEditing) return null;
  return (
    <div
      onDoubleClick={handleJump}
      className={clsx(
        "flex space-x-2 rounded-md border border-border bg-background py-2 pl-1.5 pr-2 text-sm",
        !quotedMessageProps ? "mb-2 max-w-[500px]" : "mb-1",
      )}
    >
      <div className="block min-h-[20px] min-w-[4px] rounded-sm bg-muted" />
      <div className="grow">
        <div className="flex items-start justify-between pb-1 text-xs">
          <p className="text-contrast">
            {message.user?.name}
            <span className="ml-2 w-full">
              {normalizeChatDateUi(message.created_at, true)}
            </span>
          </p>
          {!quotedMessageProps && (
            <button
              className="items-start justify-start text-contrast transition-colors hover:text-muted"
              onClick={() => setQuotedMessage(undefined)}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div
          className="text-xs text-contrast"
          dangerouslySetInnerHTML={{ __html: sanitizer(message.text ?? "") }}
        />
      </div>
    </div>
  );
};

export default QuotedMessage;
