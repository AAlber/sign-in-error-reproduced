import { track } from "@vercel/analytics";
import { type SyntheticEvent, useCallback, useMemo } from "react";
import { useSlate } from "slate-react";
import type { Attachment, Message } from "stream-chat";
import {
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  useMessageInputContext,
} from "stream-chat-react";
import { stripHtml } from "string-strip-html";
import useSaveDraftToLocalStorage from "@/src/client-functions/client-chat/useSaveDraftToLocalStorage";
import { getHtmlFormattingRegex } from "@/src/client-functions/client-utils";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import { log } from "@/src/utils/logger/logger";
import { useCustomSlateContext } from "../provider";
import { generateHtml, resetSlate } from "../utils";

export const useHandleSubmitMessage = () => {
  const { client } = useChatContext<StreamChatGenerics>("handleSubmitMessage");
  const { channel, quotedMessage } =
    useChannelStateContext<StreamChatGenerics>();

  const channelId = channel.id ?? "";
  const { clearDraft } = useSaveDraftToLocalStorage(channelId);

  const slateContext = useCustomSlateContext();
  const { listenForSlashCommands, isEditing, codeMessage, setCodeMessage } =
    slateContext;

  const { isSearching, setIsSearching, setGiphy } = useChat();
  const { sendMessage, setQuotedMessage, editMessage } =
    useChannelActionContext<StreamChatGenerics>("useHandleSubmit");

  // TODO: fix console warnings, might require big refactor
  const { fileUploads, imageUploads, removeFile, removeImage } =
    useMessageInputContext("useHandleSubmit");
  const editor = useSlate();

  const files = Object.values(fileUploads ?? {});
  const imgs = Object.values(imageUploads ?? {});

  const attachments = useMemo(() => {
    return [...files, ...imgs].map<Attachment & { file_size: number }>(
      (file) => {
        const isImage = file.file.type?.includes("image")
          ? {
              fallback: file.file.name,
              type: "image",
              image_url: file.url,
            }
          : { type: "file" };

        return {
          asset_url: file.url ?? "",
          file_size: file.file.size ?? 0,
          title: file.file.name,
          ...isImage,
        };
      },
    );
  }, [fileUploads, imageUploads]);

  const resetAttachments = () => {
    void [...files, ...imgs].forEach((i) => {
      if (!i.url) return;
      if (i.file.type?.includes("image")) {
        removeImage(i.id);
      } else {
        removeFile(i.id);
      }
    });
  };

  const generateHtml_ = () => generateHtml(editor);

  const handleEdit = useCallback(
    (e?: SyntheticEvent, blurOnSubmit = false) => {
      if (!isEditing) return;
      const { messageToEdit, clearEditingState } = slateContext;
      const html = generateHtml_();
      if (html === "<span />") return;

      const data = {
        id: messageToEdit.id,
        text: html,
        isEdited: true,
        // resend attachments if there are any
        ...(messageToEdit.attachments
          ? { attachments: messageToEdit.attachments }
          : {}),
      };

      editMessage(data).catch(console.log);

      clearEditingState(e);
      resetSlate(editor, blurOnSubmit);
    },
    [slateContext.isEditing],
  );

  const handleSubmit = useCallback(
    async (e?: SyntheticEvent, blurOnSubmit = false) => {
      let html = generateHtml_();
      if (html === "<span />") {
        if (!attachments.length) return;
      }

      const formattingRegex = getHtmlFormattingRegex(html);

      if (formattingRegex) {
        /**
         * Check if the input is a command,
         * if true strip html tags to send plain text,
         * in this case check if `/giphy`
         *
         * if false add a space before and after the word so getstream
         * can perform moderation on the contents of the text
         * https://getstream.io/chat/docs/react/block_lists/
         */
        html = html.replace(
          formattingRegex,
          (_originalWord, startTag, word, closeTag) => {
            // TODO: Check all available commands
            return listenForSlashCommands && /^(\/giphy)\s\w+$/.test(word)
              ? word
              : `${startTag} ${word} ${closeTag}`;
          },
        );
      }

      if (html.startsWith("/giphy")) {
        setGiphy({ isOpen: true, value: html.replace("/giphy ", "") });
        resetSlate(editor, true);
        return;
      }

      if (isEditing) {
        client
          .updateMessage({
            id: slateContext.messageToEdit.id,
            text: html,
            isEdited: true,
          })
          .catch(console.log);
        slateContext.clearEditingState(e);
        resetSlate(editor, blurOnSubmit);
      } else {
        const data: Partial<Message<StreamChatGenerics>> = {
          quoted_message_id: quotedMessage?.id,
          ...(!!codeMessage
            ? {
                isCode: true,
                codeValue: codeMessage.code,
                codeLanguage: codeMessage.language,
              }
            : {}),
        };
        track("Chat-Message sent");
        log.info("Chat-Message sent");

        useChat.setState({ refresh: Math.random() });
        await sendMessage(
          {
            attachments,
            text: html,
          },

          data,
        );

        if (!!quotedMessage) setQuotedMessage(undefined);
        if (isSearching) setIsSearching(false);

        const lastMessage = channel.lastMessage();
        if (
          lastMessage.type === "error" &&
          lastMessage?.text?.includes("blocked")
        ) {
          toast.warning("toast.offensive_message_error", {
            icon: "🤫",
            description: stripHtml(lastMessage.html ?? "").result,
          });
        } else {
          resetSlate(editor);
          !!attachments && resetAttachments();
          !!codeMessage && setCodeMessage(undefined);
          clearDraft();
        }
      }

      return;
    },
    [channel, attachments, quotedMessage, isSearching, codeMessage],
  );

  return { handleEdit, handleSubmit };
};
