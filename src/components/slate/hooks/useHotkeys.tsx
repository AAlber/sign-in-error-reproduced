import isHotkey from "is-hotkey";
import { type KeyboardEvent, useCallback } from "react";
import { Range, Transforms } from "slate";
import { useSlate } from "slate-react";
import { toggleMark } from "../components";
import type { MarkFormatting } from "../types";

const HOTKEYS: Record<string, MarkFormatting> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export const useHotkeys = <T extends HTMLElement>() => {
  const editor = useSlate();
  const listenHotkey = useCallback((event: KeyboardEvent<T>) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;

      if (isHotkey("left", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }
      if (isHotkey("right", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset" });
        return;
      }
    }

    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        if (!mark) return;
        toggleMark(editor, mark);
      }
    }
  }, []);

  return { listenHotkey };
};
