import CodeBlockColor from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import LinkExtension from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import AI from "@tiptap-pro/extension-ai";
import FileHandler from "@tiptap-pro/extension-file-handler";
import TableOfContent from "@tiptap-pro/extension-table-of-content";
import type { TFunction } from "i18next";
import { common, createLowlight } from "lowlight";
import { getDefaultPlaceholder } from "@/src/client-functions/client-editor";
import { omitObjectKeys, pickObjectKeys } from "@/src/utils/utils";
import BlockquoteFigure from "./blockquote-figure";
import { Column, Columns } from "./columns";
import { Document } from "./document";
import FileBlock from "./file-block";
import FileUpload from "./file-upload";
import FontSize from "./font-size";
import ImageBlock from "./image-block";
import ImageUpload from "./image-upload";
import MultipleChoice from "./multiple-choice";
import MultipleChoiceItem from "./multiple-choice-item";
import SingleChoice from "./single-choice";
import SingleChoiceItem from "./single-choice-item";
import SlashCommand from "./slash-menu";
import { Table, TableCell, TableHeader, TableRow } from "./table";
import TableOfContentNode from "./table-of-content-node";
import YoutubeEmbed from "./youtube-embed";

export const Extensions = (t: TFunction<"page">) => ({
  AI,
  Document,
  StarterKit: StarterKit.configure({
    codeBlock: false,
    document: false,
    dropcursor: false,
    blockquote: false,
    listItem: false,
    history: false,
  }),
  ListItem,
  Underline,
  Highlight: Highlight.configure({ multicolor: true }),
  History: History.configure({
    depth: 15,
    newGroupDelay: 1000,
  }),
  TextStyle,
  Subscript,
  Superscript,
  TextAlign: TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Color,
  CodeBlockColor: CodeBlockColor.configure({
    lowlight: createLowlight(common),
    defaultLanguage: null,
  }),
  Placeholder: Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: getDefaultPlaceholder(t),
  }),
  LinkExtension: LinkExtension.configure({ openOnClick: false }),
  FontSize,
  FileHandler,
  SlashCommand,
  MultipleChoice,
  MultipleChoiceItem,
  SingleChoice,
  SingleChoiceItem,
  ImageBlock,
  ImageUpload,
  FileBlock,
  FileUpload,
  YoutubeEmbed,
  Youtube: Youtube.configure({
    HTMLAttributes: {
      class: "w-full aspect-video my-6",
    },
  }),
  BlockquoteFigure,
  Focus,
  TableOfContent,
  TableOfContentNode,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Column,
  Columns,
  Dropcursor: Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
});

export type ExtensionName = keyof ReturnType<typeof Extensions>;

export const PickExtensions =
  (t: TFunction<"page">) =>
  (...extensions: ExtensionName[]) =>
    pickObjectKeys(Extensions(t), ...extensions);

export const OmitExtensions =
  (t: TFunction<"page">) =>
  (...extensions: ExtensionName[]) =>
    omitObjectKeys(Extensions(t), ...extensions);
