import { Node, ReactNodeViewRenderer } from "@tiptap/react";
import { YoutubeEmbedView } from "./components/youtube-embed-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      setYoutubeEmbed: () => ReturnType;
    };
  }
}

const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",

  isolating: true,

  defining: true,

  group: "block",

  draggable: true,

  selectable: true,

  inline: false,

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-type": this.name }];
  },

  addCommands() {
    return {
      setYoutubeEmbed:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeEmbedView);
  },
});

export default YoutubeEmbed;
