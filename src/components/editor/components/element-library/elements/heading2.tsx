import { Heading2Icon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { HeadingIcon } from "./detailed-icons";

const Heading2 = new ElementBuilder()
  .withName("heading2")
  .withDescription("heading2_desc")
  .withIcon(Heading2Icon)
  .withDetailedIcon(<HeadingIcon headingNumber={2} />)
  .withCategory("Typography")
  .withSearchTerms(["h2", "heading", "title"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/25bd996011cc4623acf79f22e0b629e2?sid=0040f60d-0aef-40bf-aa52-27ae90d46c79",
    description: "heading2_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 2 })
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setNode("heading", { level: 2 }).run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: "heading", attrs: { level: 2 } })
      .run();
  })
  .build();

export default Heading2;
