import type { Message as ThreadMessage } from "ai/react";
import cuid from "cuid";
import { AIChat, AISymbol, Message } from "fuxam-ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import useFileViewer from "../../reusable/file-viewer/zustand";
import useDocuChat from "./zustand";

export default function ChatMessageList({
  messages,
  loading,
}: {
  messages: ThreadMessage[];
  loading: boolean;
}) {
  const { user } = useUser();
  const { mode, user: userToView } = useDocuChat();
  const { t } = useTranslation("page");
  const { pspdfkit } = useFileViewer();
  const [loadingMessage, setLoadingMessage] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const renderMessage = (message: ThreadMessage) => {
    const pattern = /【[^】]+†source】/g;
    const cleanedText = message.content.replace(pattern, "");

    return (
      <Message key={cuid()}>
        {message.role === "assistant" ? (
          <AISymbol state="idle" />
        ) : (
          <Message.Picture
            className="object-cover"
            imageUrl={
              mode === "chat" ? user.image ?? "" : userToView?.image ?? ""
            }
          />
        )}
        <Message.Content>
          <Message.Title
            name={
              message.role === "assistant"
                ? t("artificial-intelligence")
                : mode === "chat"
                ? user.name
                : userToView?.name ?? user.name
            }
          />
          <Message.Text text={cleanedText} />
          {/* <Message.Annotations
            onClick={(annotation) => {
              pspdfkit.startUISearch(
                annotation.file_citation.quote.split("\n")[0],
              );
            }}
            annotations={annotations}
          /> */}
        </Message.Content>
      </Message>
    );
  };

  return (
    <AIChat className="py-2">
      {messages.map(renderMessage)}
      {loading && (
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
  );
}
