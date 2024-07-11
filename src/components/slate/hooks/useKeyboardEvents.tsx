import { type KeyboardEvent, useCallback } from "react";
import { isBlockActive, toggleBlock } from "../components";
import { useCustomSlateContext } from "../provider";
import type { CustomEditor } from "../types";
import { toggleBlockOnBackspace } from "../utils";
import { getCurrentWord } from "../utils/getCurrentWord";
import { useHotkeys } from "./useHotkeys";

const useKeyboardEvents = () => {
  const slateContext = useCustomSlateContext();
  const { isEditing } = slateContext;
  const { listenHotkey } = useHotkeys();

  /**
   * The default keyboard events - we pass this resulting callback
   * into the onKeydown event of the Slate - Editor component
   */
  const keyboardEventsHandler = useCallback(
    (props: Props) => (event: KeyboardEvent<HTMLDivElement>) => {
      const { isChat, editor } = props;

      let handleEdit: ChatMode["handleEdit"] | undefined = undefined;
      let handleSubmit: ChatMode["handleSubmit"] | undefined = undefined;
      let handleTyping: ChatMode["handleTyping"] | undefined = undefined;

      if (isChat) {
        handleEdit = props.handleEdit;
        handleSubmit = props.handleSubmit;
        handleTyping = props.handleTyping;
      }

      handleTyping?.();

      switch (event.key) {
        case "Enter": {
          const blockActive = isBlockActive(editor, "list-item");
          const quotedBlockActive = isBlockActive(editor, "block-quote");

          if (blockActive || quotedBlockActive) {
            const word = getCurrentWord(editor);
            /**
             * On enter if the current word is empty then just exit out off numbered
             * or bullet mode
             */
            if (!word.currentWord) {
              toggleBlock(
                editor,
                quotedBlockActive ? "block-quote" : "list-item",
              );

              return;
            }

            if (event.shiftKey) {
              event.preventDefault();
              editor.insertText("\n", { voids: true });
            }
            return;
          }

          if (!isChat || event.shiftKey) return;

          event.preventDefault();
          if (isEditing) {
            handleEdit?.(event, true);
          } else handleSubmit?.(event, true);

          break;
        }
        case "Backspace": {
          toggleBlockOnBackspace(editor);
          break;
        }
        case "Escape": {
          if (isEditing) slateContext.clearEditingState();
          break;
        }
        case "v": {
          if (event.metaKey) {
            // TODO: handle paste attachments
          }
        }
      }

      listenHotkey(event);
    },
    [],
  );

  return { keyboardEventsHandler };
};

export default useKeyboardEvents;

type ChatMode = {
  isChat: true;
  handleEdit: (
    e: KeyboardEvent<HTMLDivElement>,
    bool: boolean,
  ) => Promise<void> | void;
  handleSubmit: (
    e: KeyboardEvent<HTMLDivElement>,
    bool: boolean,
  ) => Promise<void> | void;
  handleTyping: () => Promise<void> | void;
};

type WorkbenchMode = { isChat?: never };
type Props = (ChatMode | WorkbenchMode) & { editor: CustomEditor };
