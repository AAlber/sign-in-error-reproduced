import { Quote } from "lucide-react";
import { ElementBuilder } from "../registry";
import { BlockquoteFigureIcon } from "./detailed-icons";

const BlockquoteFigure = new ElementBuilder()
  .withName("blockquote-figure")
  .withDescription("blockquote-figure_desc")
  .withDetailedIcon(<BlockquoteFigureIcon />)
  .withIcon(Quote)
  .withCategory("Typography")
  .withSearchTerms(["quote", "caption", "blockquote"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/cbae13281a054b55bcba5a3915762bab?sid=653bb4cc-8e56-43d6-bdf7-a7dda0cc5d27",
    description: "blockquote-figure_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setBlockquote().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setBlockquote().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, {
        type: "blockquoteFigure",
        content: [
          {
            type: "quote",
            content: [{ type: "quoteText" }],
          },
          {
            type: "quoteCaption",
          },
        ],
      })
      .run();
  })
  .build();

export default BlockquoteFigure;
