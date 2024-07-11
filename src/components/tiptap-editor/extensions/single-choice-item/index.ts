import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { SingleChoiceItemView } from "./components/single-choice-item-view";

const SingleChoiceItem = Node.create({
  name: "singleChoiceItem",

  content: "paragraph",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      choiceValue: {
        default: "hello", // TODO: generate a random string
        parseHTML: (element) => element.getAttribute("choiceValue"),
        renderHTML: (attributes) => ({
          choiceValue: attributes.choiceValue,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'li[data-type="${this.name}"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
      }),
      [
        "div",
        [
          "input",
          {
            type: "radio",
            value: node.attrs.choiceValue || null,
          },
        ],
        ["div", ["div", 0]],
      ],
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(SingleChoiceItemView, {
      as: "li",
      attrs: mergeAttributes(this.options.HTMLAttributes, {
        "data-type": this.name,
      }),
    });
  },
});

export default SingleChoiceItem;
