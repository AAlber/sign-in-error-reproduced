import { Node } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    singleChoice: {
      toggleSingleChoice: () => ReturnType;
    };
  }
}

const SingleChoice = Node.create({
  name: "singleChoice",

  group: "block list",

  content() {
    return `${this.options.itemTypeName}+`;
  },

  addOptions() {
    return {
      itemTypeName: "singleChoiceItem",
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      checkedValue: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-checked-value"),
        renderHTML: (attributes) => ({
          "data-checked-value": attributes.checkedValue,
        }),
      },
    };
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
      toggleSingleChoice:
        () =>
        ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        },
    };
  },
});

export default SingleChoice;
