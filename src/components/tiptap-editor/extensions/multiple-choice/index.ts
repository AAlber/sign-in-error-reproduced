import { Node } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    multipleChoice: {
      toggleMultipleChoice: () => ReturnType;
    };
  }
}

const MultipleChoice = Node.create({
  name: "multipleChoice",

  addOptions() {
    return {
      itemTypeName: "multipleChoiceItem",
      HTMLAttributes: {},
    };
  },

  group: "block list",

  content() {
    return `${this.options.itemTypeName}+`;
  },

  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleMultipleChoice:
        () =>
        ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        },
    };
  },
});

export default MultipleChoice;
