import { Heading3Icon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { HeadingIcon } from "./detailed-icons";

const Heading3 = new ElementBuilder()
  .withName("heading3")
  .withDescription("heading3_desc")
  .withIcon(Heading3Icon)
  .withDetailedIcon(<HeadingIcon headingNumber={3} />)
  .withCategory("Typography")
  .withSearchTerms(["h3", "heading", "title"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/db66bc6e2eab4975a98b2c54c68e0f1e?sid=c5851b7a-0aea-4a0f-abdd-373bb6721d0c",
    description: "heading3_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 3 })
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setNode("heading", { level: 3 }).run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: "heading", attrs: { level: 3 } })
      .run();
  })
  .build();

export default Heading3;
