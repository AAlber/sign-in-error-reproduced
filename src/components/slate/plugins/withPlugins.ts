import type { Editor } from "slate";
import { Element, Node, Transforms } from "slate";
import { toggleBlock } from "../components";
import { deserializeHtml } from "../utils";

export const withPlugins = (editor: Editor) => {
  const { insertData, isInline, insertText, isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    return isVoid(element);
  };

  editor.isInline = (element: Element) => {
    return element.type === "link" || element.type === "emoji"
      ? true
      : isInline(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === "emoji") {
      for (const [child] of Node.children(editor, path)) {
        const len = (child as any)?.text?.length;
        if (len > 2) {
          Transforms.setNodes(editor, { fontSize: "0.875rem" }, { at: path });
          return;
        }
      }
    }

    if (Element.isElement(node) && node.type === "paragraph") {
      switch (node?.children[0]?.text) {
        case "1. ": {
          Transforms.insertText(editor, "", { at: path });
          toggleBlock(editor, "numbered-list");
          return;
        }
        case "- ": {
          Transforms.insertText(editor, "", { at: path });
          toggleBlock(editor, "bulleted-list");
          return;
        }
      }
    }

    return normalizeNode(entry);
  };

  editor.insertText = (text: string): void => {
    return insertText(text);
  };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserializeHtml(parsed.body);

      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};
