import type { UseAssistantHelpers } from "ai/react";
import { AIChat, AISymbol, Message } from "fuxam-ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { handleMessageListScroll } from "@/src/client-functions/client-auto-lesson";
import useUser from "@/src/zustand/user";
import { isLoading } from "../functions";
import useAutoLessonChat from "../zustand";
import RenderMessage from "./render-message";

export default function ChatMessageList({
  assistant,
}: {
  assistant: UseAssistantHelpers;
}) {
  const [loadingMessage, setLoadingMessage] = useState(".");
  const { user } = useUser();
  const { t } = useTranslation("page");
  const { autoScroll } = useAutoLessonChat();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const element = document.getElementById("chat-message-list");
    if (!element) return;
    const scrollHandler = (event: Event) => handleMessageListScroll(event);
    element.addEventListener("scroll", scrollHandler);
    return () => {
      element.removeEventListener("scroll", scrollHandler);
    };
  }, [autoScroll, assistant.messages]);

  return (
    <div id="chat-message-list" className="size-full overflow-y-scroll">
      <AIChat className="flex flex-col gap-4 divide-transparent px-10 pb-14 pt-2">
        {assistant.messages.map((message) => (
          <RenderMessage key={message.id} message={message} user={user} />
        ))}
        {isLoading(assistant) && (
          <Message>
            <AISymbol state="thinking" />
            <Message.Content>
              <Message.Title name={t("artificial-intelligence")} />
              <Message.Text
                text={t("docuchat.reading_document") + loadingMessage}
                className="text-muted-contrast"
              />
            </Message.Content>
          </Message>
        )}
      </AIChat>
    </div>
  );
}
