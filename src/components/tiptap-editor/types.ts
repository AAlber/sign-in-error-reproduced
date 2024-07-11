import type { Editor } from "@tiptap/core";
import type { BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import type { Language, Tone } from "@tiptap-pro/extension-ai";
import type { TextBubbleSubMenuProps } from "./menus/types";

export type LanguageOption = {
  name: string;
  label: string;
  value: Language;
};

export type AiPromptType = "SHORTEN" | "EXTEND" | "SIMPLIFY" | "TONE";

export type AiToneOption = {
  name: string;
  label: string;
  value: Tone;
};

export type Menu = {
  enabled?: boolean;
  tippyOptions?: BubbleMenuPluginProps["tippyOptions"];
};

export type TiptapEditorMenus = {
  link?: Menu;
  textBubble?: Menu & TextBubbleSubMenuProps;
  contentDrag?: Menu;
  imageBlock?: Menu;
  tableRow?: Menu;
  tableColumn?: Menu;
  column?: Menu;
};

export type Feature = {
  enabled?: boolean;
};

export type SlashMenuCommands =
  | "image"
  | "file"
  | "youtube"
  | "table"
  | "blockquote-figure"
  | "figure"
  | "columns"
  | "table-of-content"
  | "code-block"
  | "heading1"
  | "heading2"
  | "heading3";

export type PlaceholderContent = string;

export type PlaceholderContentFn = (props: {
  editor: Editor;
  node: ProsemirrorNode;
  pos: number;
  hasAnchor: boolean;
}) => PlaceholderContent;

export type PlaceholderConfig = PlaceholderContent | PlaceholderContentFn;

export type TiptapEditorFeatures = {
  ai?: Feature & { aiToken: string };
  highlight?: Feature;
  slashCommand?: Feature & { omitSlashMenuCommand?: SlashMenuCommands[] };
  blockquoteFigure?: Feature;
  link?: Feature;
  codeBlock?: Feature;
  textStyle?: Feature;
  fontSize?: Feature;
  columns?: Feature;
  tableOfContent?: Feature;
  youtube?: Feature;
  fileHandler?: Feature;
  imageUpload?: Feature;
  fileUpload?: Feature;
  history?: Feature;
  table?: Feature;
  heading?: Feature;
  placeholder?: Feature & {
    placeholderContent?: PlaceholderConfig;
  };
};
