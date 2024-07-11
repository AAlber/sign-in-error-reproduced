import type { Range } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FileBlockView } from "./components/file-block-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fileBlock: {
      setFileBlock: (attributes: { src: string; name: string }) => ReturnType;
      setFileBlockAt: (attributes: {
        src: string;
        name: string;
        pos: number | Range;
      }) => ReturnType;
    };
  }
}

const FileBlock = Image.extend({
  name: "fileBlock",

  group: "block",

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-src"),
        renderHTML: (attributes) => ({
          "data-src": attributes.src,
        }),
      },
      name: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-name"),
        renderHTML: (attributes) => ({
          "data-name": attributes.name,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setFileBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "fileBlock",
            attrs: { src: attrs.src, name: attrs.name },
          });
        },

      setFileBlockAt:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContentAt(attrs.pos, {
            type: "fileBlock",
            attrs: { src: attrs.src, name: attrs.name },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileBlockView);
  },
});

export default FileBlock;
