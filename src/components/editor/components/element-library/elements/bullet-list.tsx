import { List } from "lucide-react";
import { ElementBuilder } from "../registry";
import { BulletListIcon } from "./detailed-icons";

const BulletList = new ElementBuilder()
  .withName("bullet-list")
  .withDescription("bullet-list_desc")
  .withIcon(List)
  .withDetailedIcon(<BulletListIcon />)
  .withCategory("Typography")
  .withSearchTerms(["ul", "unordered-list", "list", "bullet-list"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/e4c6f69dfa3a4d59a547350e5d0c04a5?sid=0c9c82fb-bf8d-4c13-bae3-367a42eb12de",
    description: "bullet-list_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: "bulletList",
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
        type: "bulletList",
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
        type: "bulletList",
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

export default BulletList;
