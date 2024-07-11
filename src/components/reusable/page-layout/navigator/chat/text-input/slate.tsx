import clsx from "clsx";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Transforms } from "slate";
import { Editable, ReactEditor, useSlateStatic } from "slate-react";
import { useChatContext } from "stream-chat-react";
import useSaveDraftToLocalStorage from "@/src/client-functions/client-chat/useSaveDraftToLocalStorage";
import classNames from "@/src/client-functions/client-utils";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import { AITextTransformerButton } from "@/src/components/reusable/ai-tool";
import type { SlateProviderProps } from "@/src/components/slate";
import {
  renderElement,
  renderLeaf,
  SlateProvider,
  SlateToolbar,
  useCustomSlateContext,
  useHandleSubmitMessage,
} from "@/src/components/slate";
import useKeyboardEvents from "@/src/components/slate/hooks/useKeyboardEvents";
import { deserializeHtml, resetSlate } from "@/src/components/slate/utils";
import { log } from "@/src/utils/logger/logger";
import useChat from "../zustand";
import InputAttachments from "./attachments";
import CodeMessage from "./code-message";
import EditOptions from "./edit-options";
import QuotedMessage from "./quoted-message";

const SlateInput = () => {
  const slateContext = useCustomSlateContext();
  const { isEditing } = slateContext;

  const editor = useSlateStatic();
  const renderElementComponent = useCallback(renderElement, []);
  const renderLeafComponent = useCallback(renderLeaf, []);
  const { isSearching } = useChat();
  const { channel } = useChatContext();
  const { t } = useTranslation("page");
  const { saveDraftToLocalStorage } = useSaveDraftToLocalStorage(
    channel?.id ?? "",
  );

  const isInLobby = pageHandler.get.currentPage().titleKey !== "CHAT";

  const { handleEdit, handleSubmit } = useHandleSubmitMessage();
  const { keyboardEventsHandler } = useKeyboardEvents();
  const [editorText, setEditorText] = useState("");

  const handleTyping = useCallback(
    debounce(() => {
      channel?.keystroke().catch(console.log);
      saveDraftToLocalStorage();
    }, 10),
    [channel],
  );

  const keyboardEventsHandler_ = useCallback(
    keyboardEventsHandler({
      editor,
      handleEdit,
      handleSubmit,
      handleTyping,
      isChat: true,
    }),
    [handleEdit, handleSubmit, handleTyping],
  );

  useEffect(() => {
    if (isSearching) return;
    setTimeout(() => {
      try {
        /**
         * focus on the input upon selecting
         * a channel and after the channel has loaded
         */
        ReactEditor.focus(editor);
      } catch (e) {}
    }, 100);
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    /**
     * If we are in edit mode, render the message
     * inside the input
     */
    const text = slateContext.messageToEdit.text;
    if (text) {
      const parsed = new DOMParser().parseFromString(text, "text/html");

      const fragment = deserializeHtml(parsed.body);
      editor.insertFragment(fragment);
    }

    return () => {
      resetSlate(editor);
    };
  }, [isEditing]);

  const improveTextWithAI = (improvedText) => {
    try {
      log.info("Parsing improved text from AI");
      const parsed = new DOMParser().parseFromString(improvedText, "text/html");
      const fragment = deserializeHtml(parsed.body);
      log.info("Replacing incorrect text with the improved text");
      Editor.withoutNormalizing(editor, () => {
        Transforms.delete(editor, {
          at: {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          },
        });
        Transforms.insertFragment(editor, fragment);
      });
      log.info("AI text improvement completed successfully.");
    } catch (e) {
      log.info("Error during AI text improvement: ", e);
    }
  };
  const getCurrentEditorText = () => {
    const text = Node.string(editor);
    setEditorText(text);
  };

  useEffect(() => {
    getCurrentEditorText();
  }, [editor.children]);

  return (
    <div
      className={clsx(isEditing && "mt-4")}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className={classNames(
          "mx-[-20px] border-t border-border",
          !isInLobby && "!bg-foreground",
        )}
        style={{ padding: "20px 20px" }}
      >
        <div className="mx-auto max-w-[1336px] rounded-md border border-border bg-foreground p-2">
          <QuotedMessage />
          <InputAttachments />
          <CodeMessage
            codeMessage={slateContext.codeMessage}
            setCodeMessage={slateContext.setCodeMessage}
          />

          <div
            className="resize-container p-2"
            style={{
              resize: "vertical",
              overflow: "auto",
              maxHeight: "300px",
              minHeight: "70px",
            }}
          >
            <Editable
              renderElement={renderElementComponent}
              renderLeaf={renderLeafComponent}
              spellCheck
              className="overflow-y-scroll text-sm text-contrast outline-none ring-0"
              placeholder={t("chat.message_input_placeholder")}
              onKeyDown={keyboardEventsHandler_}
            />
          </div>
          <div className="absolute right-5 top-7">
            <AITextTransformerButton
              onCompletion={improveTextWithAI}
              text={editorText}
              className="text-muted-contrast"
              variant="ghost"
              tooltipText="Correct Grammar"
              disabled={!editorText}
            />
          </div>
        </div>
        <SlateToolbar />
        {isEditing && (
          <EditOptions
            onCancel={slateContext.clearEditingState}
            onSave={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

const SlateMain = (props: SlateProviderProps) => {
  return (
    <SlateProvider {...props}>
      <SlateInput />
    </SlateProvider>
  );
};

export default SlateMain;
