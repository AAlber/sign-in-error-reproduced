import type { Message } from "ai/react";
import { useAssistant } from "ai/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames from "@/src/client-functions/client-utils";
import api from "@/src/pages/api/api";
import AIInputField from "../../reusable/ai-input-field";
import ChatMessageList from "./chat-list";
import DocuChatNoMessages from "./no-messages";
import useDocuChat from "./zustand";

export default function DocuChatDisplay({
  messageList,
}: {
  messageList: Message[];
}) {
  const {
    mode,
    block,
    userStatus,
    setMessages: setMessageList,
  } = useDocuChat();

  const {
    status,
    setMessages,
    messages,
    input,
    submitMessage,
    stop,
    handleInputChange,
  } = useAssistant({
    api: api.handleNewThreadMessage,
    body: {
      assistantId: block.specs.assistantId,
    },
    threadId: userStatus.userData?.threadId,
  });

  const { t } = useTranslation("page");

  useEffect(() => {
    if (messages.length > 0 && block.userStatus === "NOT_STARTED") {
      contentBlockHandler.userStatus.update({
        blockId: block.id,
        data: {
          status: "IN_PROGRESS",
        },
      });
    }
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    setMessages(messageList);
  }, [open]);

  useEffect(() => {
    const chatMessageList = document.getElementById("chat-message-list");
    if (chatMessageList) {
      chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="flex size-full">
        <div className="relative flex h-full flex-1 flex-col gap-2 bg-foreground">
          {mode === "chat" && (
            <div className="flex items-center justify-center border-b border-border px-4 py-1 text-xs text-muted-contrast">
              {t("conversation_is_recorded")}
            </div>
          )}
          <div
            id="chat-message-list"
            className={classNames(
              mode === "chat" && "mb-16",
              "h-full overflow-scroll",
            )}
          >
            <ChatMessageList
              messages={messages}
              loading={
                status === "in_progress" &&
                messages[messages.length - 1]?.role === "user"
              }
            />
            {messages.length === 0 && <DocuChatNoMessages />}
          </div>
          {mode === "chat" && (
            <div className="absolute inset-x-2 bottom-0 rounded-t-lg bg-foreground">
              <AIInputField
                value={input}
                onInputChange={handleInputChange}
                onSubmit={submitMessage}
                stop={stop}
                placeholder={t("placeholder")}
                isLoading={status === "in_progress"}
                isDisabled={status === "in_progress"}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
