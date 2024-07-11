import { ListOrdered } from "lucide-react";
import { ElementBuilder } from "../registry";
import { NumberedListIcon } from "./detailed-icons";

const NumberedList = new ElementBuilder()
  .withName("numbered-list")
  .withDescription("numbered-list_desc")
  .withIcon(ListOrdered)
  .withDetailedIcon(<NumberedListIcon />)
  .withCategory("Typography")
  .withSearchTerms(["ol", "ordered-list", "list", "numbered-list"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/f3940d0dbe8e40b697adf23f9b5ea46c?sid=d8a7164f-8fae-4962-9f2a-6ce24f6e532f",
    description: "numbered-list_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [{ type: "paragraph" }],
          },
        ],
      })
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [{ type: "paragraph" }],
          },
        ],
      })
      .run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [{ type: "paragraph" }],
          },
        ],
      })
      .run();
  })
  .build();

export default NumberedList;
