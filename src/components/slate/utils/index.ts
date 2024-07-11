import escapeHtml from "escape-html";
import { type Descendant, Editor, Range, Transforms } from "slate";
import { Text } from "slate";
import { jsx } from "slate-hyperscript";
import { ReactEditor } from "slate-react";
import {
  isBlockActive,
  renderElementNode,
  renderLeafNode,
  toggleBlock,
} from "../components";
import type {
  BlockFormatting,
  CustomEditor,
  CustomElementTypes,
  MarkFormatting,
} from "../types";
import { getCurrentWord } from "./getCurrentWord";

export function serializeToHtml(node: Descendant): string {
  if (Text.isText(node)) {
    let html = escapeHtml(node.text);
    html = `${renderLeafNode(node, html, true)}`;
    return html;
  }

  const children = node?.children?.map((n) => serializeToHtml(n)).join("");

  const element = renderElementNode({
    element: node,
    attributes: {} as any,
    children,
    isString: true,
  });

  if (typeof element !== "string") return `<p>${children}</p>`;
  return element;
}

export function generateHtml(editor: Editor) {
  const nodes = editor.children.map(serializeToHtml);

  /**
   * Only allow 1 new line, remove all other empty lines
   */
  const newLine = [
    "<p></p>",
    "<p><u></u></p>",
    "<p><u><em></em></u></p>",
    "<p><u><em><strong></strong></em></u></p>",
    "<p><u><strong></strong></u></p>",
    "<p><em></em></p>",
    "<p><em><strong></strong></em></p>",
    "<p><strong></strong></p>",
  ];

  let html = nodes.reduce((p, c) => {
    const isNewLine = newLine.includes(c);
    const char = isNewLine ? "<br />" : c;

    return p.endsWith("<br />") && isNewLine ? `${p}` : `${p}${char}`;
  }, "");

  html = html === "<br />" ? "<span />" : html;
  return html;
}

export function deserializeHtml(
  el: HTMLElement | Node,
  markAttributes: Record<MarkFormatting, true> = {} as Record<
    MarkFormatting,
    true
  >,
) {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx("text", markAttributes, el.textContent);
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes = { ...markAttributes };

  // define attributes for text nodes
  switch (el.nodeName) {
    case "STRONG":
      nodeAttributes.bold = true;
      break;
    case "EM":
      nodeAttributes.italic = true;
      break;
    case "U":
      nodeAttributes.underline = true;
      break;
    case "S":
      nodeAttributes.strikethrough = true;
      break;
    case "CODE":
      nodeAttributes.code = true;
  }

  const children = Array.from(el.childNodes)
    .map((node) => deserializeHtml(node, nodeAttributes))
    .flat();

  if (children.length === 0) {
    children.push(jsx("text", nodeAttributes, ""));
  }

  switch (el.nodeName) {
    case "BODY":
      return jsx("fragment", {}, children);
    case "BR":
      return jsx("element", { type: "paragraph" }, children);
    case "BLOCKQUOTE":
      return jsx("element", { type: "block-quote" }, children);
    case "P":
      return jsx("element", { type: "paragraph" }, children);
    case "OL":
      return jsx("element", { type: "numbered-list" }, children);
    case "UL":
      return jsx("element", { type: "bulleted-list" }, children);
    case "LI":
      const b = jsx("element", { type: "list-item" }, children);
      return b;
    case "A":
      const ael = el as any;
      return jsx(
        "element",
        {
          type: "link",
          href: ael.getAttribute("href"),
        },
        children,
      );
    default:
      return children;
  }
}

export function resetSlate(editor: CustomEditor, blurOnConfirm = false) {
  /**
   * Clears text from input
   */
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  });

  const marks: MarkFormatting[] = [
    "bold",
    "code",
    "italic",
    "strikethrough",
    "underline",
  ];

  const blocks: CustomElementTypes[] = [
    "numbered-list",
    "bulleted-list",
    "block-quote",
    "list-item",
  ];

  /**
   * Removes all formatting
   */

  marks.forEach((mark) => {
    Editor.removeMark(editor, mark);
  });

  /**
   * Removes all blocks
   */

  blocks.forEach((block) => {
    const isActive = isBlockActive(editor, block);
    if (isActive) {
      toggleBlock(editor, block);
    }
  });

  if (blurOnConfirm) {
    ReactEditor.blur(editor);
  }
}

export const getWordBefore = (editor: Editor) => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return;

  const [start] = Range.edges(selection);
  const wordBefore = Editor.before(editor, start, { unit: "word" });
  const before = wordBefore && Editor.before(editor, wordBefore);
  const beforeRange = before && Editor.range(editor, before, start);
  const beforeText = beforeRange && Editor.string(editor, beforeRange);

  return { word: beforeText, range: beforeRange };
};

export const getWordAfter = (editor: Editor) => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return;

  const [start] = Range.edges(selection);
  const after = Editor.after(editor, start);
  const afterRange = Editor.range(editor, start, after);
  const afterText = Editor.string(editor, afterRange);

  return afterText;
};

/**
 * On backspace, if the last block is a block (list or blockquote) with
 * empty words, then toggle the blockList format
 */
export function toggleBlockOnBackspace(editor: CustomEditor) {
  const currentWord = getCurrentWord(editor);
  if (currentWord.currentRange) {
    const { anchor } = editor.range(currentWord.currentRange);
    const [parentPath] = anchor.path;

    const list: BlockFormatting[] = [
      "numbered-list",
      "bulleted-list",
      "block-quote",
    ];

    if (typeof parentPath === "number") {
      const elem = editor.fragment([parentPath]) as any;
      if (list.includes(elem[0].type) && elem[0].children.length === 1) {
        switch (elem[0].type) {
          case "block-quote": {
            if (!elem[0].children[0]?.text) toggleBlock(editor, "block-quote");
            break;
          }
          default: {
            if (!elem[0].children[0].children[0].text)
              toggleBlock(editor, elem[0].type);
          }
        }
      }
    }
  }
}
