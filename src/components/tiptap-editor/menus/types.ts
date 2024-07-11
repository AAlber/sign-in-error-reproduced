import type { Editor as EditorCore } from "@tiptap/core";
import type { BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";

export interface ShouldShowProps {
  editor?: EditorCore;
  view: EditorView;
  state?: EditorState;
  oldState?: EditorState;
  from?: number;
  to?: number;
}

export interface MenuProps {
  editor: Editor;
  tippyOptions?: BubbleMenuPluginProps["tippyOptions"];
}

type EnableMenu = {
  enabled?: boolean;
};

export interface TextBubbleSubMenuProps {
  subMenu?: {
    ai?: EnableMenu;
    fontSizes?: EnableMenu;
    fontColors?: EnableMenu;
    highlightColors?: EnableMenu;
    codeBlock?: EnableMenu;
    code?: EnableMenu;
    link?: EnableMenu;
    subscript?: EnableMenu;
    superscript?: EnableMenu;
    underline?: EnableMenu;
    bold?: EnableMenu;
    italic?: EnableMenu;
    strikethrough?: EnableMenu;
    alignLeft?: EnableMenu;
    alignCenter?: EnableMenu;
    alignRight?: EnableMenu;
    alignJustify?: EnableMenu;
  };
}
