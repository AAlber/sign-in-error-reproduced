import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { MultipleChoiceItemView } from "./components/multiple-choice-item-view";

const MultipleChoiceItem = Node.create({
  name: "multipleChoiceItem",

  content: "paragraph",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-checked") === "true",
        renderHTML: (attributes) => ({
          "data-checked": attributes.checked,
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
            type: "checkbox",
            checked: node.attrs.checked ? "checked" : null,
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
    return ReactNodeViewRenderer(MultipleChoiceItemView, {
      as: "li",
      attrs: mergeAttributes(this.options.HTMLAttributes, {
        "data-type": this.name,
      }),
    });
  },
});

export default MultipleChoiceItem;
