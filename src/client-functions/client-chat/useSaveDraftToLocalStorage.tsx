import { useCallback, useEffect } from "react";
import { Editor } from "slate";
import { useSlateStatic } from "slate-react";
import { useCustomSlateContext } from "@/src/components/slate";
import { deserializeHtml, generateHtml } from "@/src/components/slate/utils";

const CHAT_KEY = "chat-drafts";

const useSaveDraftToLocalStorage = (channelId: string) => {
  const editor = useSlateStatic();
  const { isEditing } = useCustomSlateContext();

  useEffect(() => {
    const drafts = getDrafts();
    if (drafts && channelId in drafts) {
      const text = drafts[channelId];
      if (!!isEditing || !text || text === "<span />") {
        clearDraft();
        return;
      }

      const parsed = new DOMParser().parseFromString(text, "text/html");
      const draft = deserializeHtml(parsed.body);

      /**
       * hack,
       * prevent from appending text again on component rerender
       */

      const firstChild = editor.children[0] as any;
      if (
        firstChild &&
        firstChild.type === "paragraph" &&
        !firstChild.children[0].text
      ) {
        // append text from localstorage to text input
        editor.insertFragment(draft);

        // move cursor to end of text, need to add slight delay here
        const timeout = setTimeout(
          () => editor.select(Editor.end(editor, [])),
          300,
        );
        return () => clearTimeout(timeout);
      }
    }
  }, [channelId]);

  const getDrafts = useCallback(() => {
    const stringDrafts = localStorage.getItem(CHAT_KEY);
    if (stringDrafts) {
      return JSON.parse(stringDrafts) as Record<string, string>;
    }
  }, [channelId]);

  const saveDraftToLocalStorage = useCallback(() => {
    const text = generateHtml(editor);

    const data = {
      [channelId]: text,
    };

    const draftsInLocalStorage = getDrafts() ?? {};
    const stringDrafts = JSON.stringify({ ...draftsInLocalStorage, ...data });

    localStorage.setItem(CHAT_KEY, stringDrafts);
  }, [channelId]);

  const clearDraft = useCallback(() => {
    const drafts = getDrafts();
    if (drafts && channelId in drafts) {
      const clone = { ...drafts };
      delete clone[channelId];

      localStorage.setItem(CHAT_KEY, JSON.stringify(clone));
    }
  }, [channelId]);

  return {
    clearDraft,
    saveDraftToLocalStorage,
  };
};

export default useSaveDraftToLocalStorage;
