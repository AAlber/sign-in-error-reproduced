/* eslint-disable tailwindcss/no-custom-classname */
import clsx from "clsx";
import * as DOMPurify from "dompurify";
import escapeHtml from "escape-html";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { MessageTextProps } from "stream-chat-react";
import { useMessageContext } from "stream-chat-react";
import { stripHtml } from "string-strip-html";
import {
  getHtmlFormattingRegex,
  isUrl,
  normalizeLink,
} from "@/src/client-functions/client-utils";
import QuotedMessage from "@/src/components/reusable/page-layout/navigator/chat/text-input/quoted-message";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import CodeMessage from "../text-input/code-message";
import MessagePoll from "./polls";

// This component renders the main text of the chat message

const MessageContent = (
  props: MessageTextProps<StreamChatGenerics> & { isMyMessage: boolean },
) => {
  const { t } = useTranslation("page");
  const { message: propMessage, isMyMessage, theme = "simple" } = props;
  const { message: contextMessage } = useMessageContext<StreamChatGenerics>();

  const messageTextRef = useRef<HTMLDivElement>(null);
  const message = propMessage || contextMessage;
  const sanitizer = DOMPurify.sanitize;

  const normalizeText = () => {
    if (!message.text) return "";

    // if any of the following pass, skip normalizeWithLinks
    switch (true) {
      case message.type === "error":
        return message.text;
      case !!message.poll:
        return message.text;
    }

    return normalizeWithLinks(message.text);
  };

  let renderText = normalizeText();
  if (!renderText && !message.quoted_message) return null;

  const isEmptyMessage = renderText === "<span />";

  /** Trim whitespace from text */
  const formattingRegex = getHtmlFormattingRegex(renderText);
  if (formattingRegex) {
    const regex = renderText.match(formattingRegex);
    if (regex) {
      renderText = regex[2]?.trim() ?? "";
      if (renderText) {
        renderText = [regex[1], renderText, regex[3]].join("");
      }
    }
  }

  return (
    <div
      tabIndex={0}
      className={clsx(
        "select-text overflow-hidden break-all leading-5 text-contrast",
        !isEmptyMessage && "[&_+.message-attachment]:!mt-1",
        message.type === "error" && "text-muted-contrast",
      )}
    >
      {message.type === "error" && (
        <div
          className={`str-chat__${theme}-message--error-message str-chat__message--error-message text-sm`}
        >
          {t("course_message_failed3")}
        </div>
      )}
      {message.status === "failed" && (
        <div
          className={`str-chat__${theme}-message--error-message str-chat__message--error-message`}
        >
          {message.errorStatusCode !== 403
            ? t("course_message_failed1")
            : t("course_message_failed2")}
        </div>
      )}
      {!!message.quoted_message && (
        <QuotedMessage quotedMessage={message.quoted_message as any} />
      )}

      {message.isCode && (
        <CodeMessage
          isMyMessage={isMyMessage}
          minHeightCollapsed="min-h-[80px]"
          codeMessage={{
            code: message.codeValue,
            language: message.codeLanguage,
          }}
        />
      )}
      {message.text && (
        <div className="flex items-end space-x-2">
          <div
            className={clsx(
              "chat--message-content text-sm [&>*]:!whitespace-pre-wrap [&>p]:min-w-0 first-of-type:[&_blockquote]:mt-2 last-of-type:[&_blockquote]:mb-2",
              message.type === "error" && "!text-muted-contrast",
              isMyMessage
                ? "text-white [&_.chat--link-attachment]:text-blue-200"
                : "text-contrast [&_.chat--link-attachment]:text-primary",
            )}
            ref={messageTextRef}
            dangerouslySetInnerHTML={{
              __html: sanitizer(renderText),
            }}
          />
        </div>
      )}
      {message.poll && <MessagePoll message={message} />}
    </div>
  );
};

export default React.memo(MessageContent);

export function normalizeWithLinks(str: string) {
  const words = getHtmlElments(str);

  return words.reduce((p, c) => {
    const parseForUrls = c
      .split(" ")
      .map((word) => {
        const stripped = stripHtml(word).result.trim();
        const isUrl_ = isUrl(stripped);

        if (isUrl_) {
          const cleanUrl = escapeHtml(stripped);
          const url = normalizeLink(cleanUrl);

          return `<a href="${url}" target="_blank" class="chat--link-attachment hover:underline" rel="noreferrer">${cleanUrl}</a>`;
        }

        return word;
      })
      .join(" ");

    return `${p} ${parseForUrls}`.trim();
  }, "");
}

function getHtmlElments(htmlString: string) {
  const div = document.createElement("div");
  div.insertAdjacentHTML("beforeend", htmlString);

  const elements = Array.from(div.children)
    // .filter((p) => p.textContent !== "") // remove line breaks here?
    .map((p) => p.outerHTML);

  div.remove();
  return elements;
}
