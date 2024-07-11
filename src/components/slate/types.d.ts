import type { CSSProperties } from "react";
import type { BaseEditor, Range } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

type BaseElementProps = {
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
} & BaseElementProps;

export type EmojiElement = {
  type: "emoji";
  fontSize: string;
  emoji: string;
} & BaseElementProps;

export type BlockQuoteElement = {
  type: "block-quote";
} & BaseElementProps;

export type H1Element = {
  type: "heading-one";
} & BaseElementProps;

export type H2Element = {
  type: "heading-two";
} & BaseElementProps;

export type BulletedListElement = {
  type: "bulleted-list";
} & BaseElementProps;

export type ListItemElement = {
  type: "list-item";
} & BaseElementProps;

export type NumberedListElement = {
  type: "numbered-list";
} & BaseElementProps;

export type LinkElement = {
  type: "link";
  href: string;
} & BaseElementProps;

export type CustomElement =
  | ParagraphElement
  | EmojiElement
  | LinkElement
  | H1Element
  | H2Element
  | BlockQuoteElement
  | BulletedListElement
  | ListItemElement
  | NumberedListElement;

export type FormattedText = {
  text: string;
  align?: TextAlign;
} & Partial<Record<MarkFormatting, true>>;

export type CustomText = FormattedText;
export type CustomElementTypes = CustomElement["type"];
export type OrNull<T> = null | T;
export type TextAlign = CSSProperties["textAlign"];

export type MarkFormatting =
  | "bold"
  | "code"
  | "italic"
  | "underline"
  | "strikethrough";

export type BlockFormatting = CustomElementTypes | NonNullable<TextAlign>;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type TargetType = Range | undefined | null;
export type SetTargetType = React.Dispatch<React.SetStateAction<TargetType>>;
