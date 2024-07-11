import { Book } from "lucide-react";
import { ElementBuilder } from "../registry";
import { TableOfContentIcon } from "./detailed-icons";

const TableOfContent = new ElementBuilder()
  .withName("table-of-content")
  .withDescription("table-of-content")
  .withIcon(Book)
  .withDetailedIcon(<TableOfContentIcon />)
  .withCategory("Typography")
  .withSearchTerms(["table", "content", "table of content"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/49fc2a77d2844ceab989987a917a5a86?sid=ac821ca5-bd8b-4373-be7e-d8acd9951c0d",
    description: "table-of-content_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).insertTableOfContent().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().insertTableOfContent().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, {
        type: "tableOfContentNode",
      })
      .run();
  })
  .build();

export default TableOfContent;
