import type { Editor } from "@tiptap/react";
import { useCallback } from "react";
import {
  isCustomNodeSelected,
  isTextSelected,
} from "@/src/client-functions/client-editor";
import type { ShouldShowProps } from "../menus/types";

export const useTextStates = (editor: Editor) => {
  const shouldShow = useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected(editor);
    },
    [editor],
  );

  return {
    shouldShow,
    isBold: editor.isActive("bold"),
    isItalic: editor.isActive("italic"),
    isUnderline: editor.isActive("underline"),
    isStrike: editor.isActive("strike"),
    isCode: editor.isActive("code"),
    isSubscript: editor.isActive("subscript"),
    isSuperscript: editor.isActive("superscript"),
    isAlignLeft: editor.isActive({ textAlign: "left" }),
    isAlignCenter: editor.isActive({ textAlign: "center" }),
    isAlignRight: editor.isActive({ textAlign: "right" }),
    isAlignJustify: editor.isActive({ textAlign: "justify" }),
    currentColor:
      (editor.getAttributes("textStyle")?.color as string) || undefined,
    currentHighlight:
      (editor.getAttributes("highlight")?.color as string) || undefined,
    currentSize:
      (editor.getAttributes("textStyle")?.fontSize as string) || undefined,
  };
};
