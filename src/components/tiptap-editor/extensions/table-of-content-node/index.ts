import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TableOfContentNodeView } from "./components";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableOfContentNode: {
      insertTableOfContent: () => ReturnType;
    };
  }
}

const TableOfContentNode = Node.create({
  name: "tableOfContentNode",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,
  inline: false,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="table-of-content"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-type": "table-of-content" }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableOfContentNodeView);
  },

  addCommands() {
    return {
      insertTableOfContent:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});

export default TableOfContentNode;
