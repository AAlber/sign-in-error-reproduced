import { Node } from "@tiptap/core";
import { QuoteText } from "./quote-text";

export const Quote = Node.create({
  name: "quote",

  content: "quoteText+",

  defining: true,

  marks: "",

  addExtensions() {
    return [QuoteText];
  },

  parseHTML() {
    return [
      {
        tag: "blockquote",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["blockquote", HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => false,
    };
  },
});
