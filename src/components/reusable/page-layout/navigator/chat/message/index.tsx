/* eslint-disable tailwindcss/no-custom-classname */
import clsx from "clsx";
import dayjs from "dayjs";
import { Pin } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  areMessageUIPropsEqual,
  type MessageContextValue,
  MessageErrorIcon,
  messageHasReactions,
  type MessageUIComponentProps,
  type StreamMessage,
  useChannelStateContext,
  useChatContext,
  useMessageContext,
} from "stream-chat-react";
import { normalizeChatDateUi } from "@/src/client-functions/client-chat";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import SlateMain from "../text-input/slate";
import type { StreamChatGenerics } from "../types";
import MessageAttachments from "./attachments";
import MessageContent from "./message-content";
import MessageUnseenStart from "./message-unseen-start";
import MessageContentWithOptions from "./options";
import MessageReactions from "./reactions";
import SeenBy from "./seen-by";

const MessageWithContext = (props: MessageContextValue<StreamChatGenerics>) => {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { t } = useTranslation("page");
  const {
    clearEditingState,
    editing,
    groupStyles,
    handleRetry,
    isMyMessage,
    isReactionEnabled,
    message,
    renderText,
  } = props;

  const [isDeleted, setIsDeleted] = useState(false);
  const { messages } = useChannelStateContext<StreamChatGenerics>();
  const { client } = useChatContext<StreamChatGenerics>();

  if (!messages || !message.user || !message.created_at) return null;

  const hasReactions = messageHasReactions(message);
  const myMessage = isMyMessage?.() ?? false;

  const allowRetry =
    message.status === "failed" && message.errorStatusCode !== 403;

  const isFirstOfGroup =
    (groupStyles?.[0] === "top" || groupStyles?.[0] === "single") ?? false;

  const handleDeleteMessage = async () => {
    setIsDeleted(true);
    await client.deleteMessage(message.id);
  };

  const createdAt = dayjs(message.created_at).date();

  /**
   * This mapping returns an object of all messages fetched with the
   * date as key and array of messages as value. Used to get the first
   * message of the day
   */
  const messageMapped = messages.reduce<Record<number, any[]>>((p, c) => {
    if (c.deleted_at) return p;
    if (!c.created_at) return p;
    const date = dayjs(c.created_at).date();

    if (date in p) {
      const val = p[date];
      if (typeof val === "undefined") return p;
      p[date] = [...val, c];
      return p;
    }
    return { ...p, [date]: [c] };
  }, {});

  const isAnotherDay = message.id === messageMapped?.[createdAt]?.[0].id;
  const newLine = isAnotherDay || isFirstOfGroup;

  if (message.customType === CUSTOM_MESSAGE_TYPE.date) return null;
  if (message.deleted_at || message.type === "deleted") return null;

  return (
    <div
      key={message.id}
      className={clsx(
        "relative transition-all duration-1000 ease-in-out lg:relative",
        isDeleted ? "max-h-0 overflow-hidden" : "max-h-[9999px]",
      )}
    >
      {isAnotherDay && (
        <div className="my-4 w-full">
          <div className="p-4 text-center text-xs text-muted-contrast">
            <span className="rounded-full bg-background px-4 py-0.5 font-medium text-muted-contrast">
              {new Date(message.created_at).getDate() === new Date().getDate()
                ? t("chat.messages_today")
                : normalizeChatDateUi(message.created_at)}
            </span>
          </div>
        </div>
      )}
      <MessageUnseenStart messageId={message.id} />
      <MessageStartMeta
        isFirstOfGroup={isFirstOfGroup}
        isMyMessage={myMessage}
        isNewLine={newLine}
        message={message}
      />
      <div
        className={clsx(
          "relative mb-[2px] flex items-center",
          myMessage ? "justify-end" : "justify-start",
        )}
        onClick={allowRetry ? () => handleRetry(message) : undefined}
        onKeyUp={allowRetry ? () => handleRetry(message) : undefined}
      >
        <div
          className={clsx(
            "min-w-[48px] self-start",
            myMessage ? "hidden" : "hidden lg:block",
          )}
        >
          {isFirstOfGroup && (
            <div className={clsx("relative size-8")}>
              <UserDefaultImage
                dimensions="h-8 w-8"
                user={{
                  id: message.user.id,
                  image: message.user.image,
                }}
              />
            </div>
          )}
        </div>

        {editing ? (
          <SlateMain
            isEditing
            messageToEdit={message}
            clearEditingState={clearEditingState}
          />
        ) : (
          <MessageContentWithOptions onDelete={handleDeleteMessage}>
            <div
              className={clsx(
                "message-bubble border px-2 leading-tight",
                message.isCode ? "w-full" : "lg:max-w-[60%]",
                hasReactions ? "pb-3 pt-1.5" : "py-1.5",
                myMessage
                  ? "my-message-bubble order-1 border-ring/70 bg-ring dark:bg-ring/60"
                  : "bg-foreground dark:border-muted/80 dark:bg-muted",
              )}
            >
              {!!message.attachments?.length && !message.quoted_message && (
                <MessageAttachments message={message} />
              )}
              <MessageContent
                message={message}
                renderText={renderText}
                isMyMessage={myMessage}
              />
              {!!message.error && <MessageErrorIcon />}
            </div>
          </MessageContentWithOptions>
        )}
      </div>
      {hasReactions && isReactionEnabled && !editing && (
        <MessageReactions message={message} />
      )}
      <SeenBy
        hasReactions={hasReactions}
        isMyMessage={myMessage}
        message={message}
      />
    </div>
  );
};

const MemoizedMessage = React.memo(
  MessageWithContext,
  areMessageUIPropsEqual,
) as typeof MessageWithContext;

const Message = (props: MessageUIComponentProps<StreamChatGenerics>) => {
  const messageContext = useMessageContext<StreamChatGenerics>();
  return <MemoizedMessage {...messageContext} {...props} />;
};

export default Message;

export const CUSTOM_MESSAGE_TYPE = {
  date: "message.date",
  intro: "channel.intro",
} as const;

const MessageStartMeta = (props: {
  message: StreamMessage<StreamChatGenerics>;
  isFirstOfGroup: boolean;
  isMyMessage: boolean;
  isNewLine: boolean;
}) => {
  const { isFirstOfGroup, isMyMessage, isNewLine, message } = props;
  const { lastReceivedId } = useMessageContext<StreamChatGenerics>();
  const { t } = useTranslation("page");

  if (
    isFirstOfGroup ||
    message.isEdited ||
    !!message.pinned ||
    (lastReceivedId === message.id && message.isEdited)
  ) {
    return (
      <p
        className={clsx(
          "mb-0.5 flex items-center space-x-2 text-xs text-muted-contrast",
          isNewLine && "mt-2",
          isMyMessage ? "justify-end" : "lg:ml-12",
        )}
      >
        {!!message.pinned && <Pin size={10} />}
        <span className={clsx(isMyMessage && "hidden")}>
          {message.user?.name ?? "(Deleted User)"}
        </span>
        <span>
          {normalizeChatDateUi(message.created_at, true, undefined, true)}
        </span>
        {message.isEdited && <span>{t("chat.message.edited")}</span>}
      </p>
    );
  }

  return null;
};
