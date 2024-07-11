import { Heading1Icon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { HeadingIcon } from "./detailed-icons";

const Heading1 = new ElementBuilder()
  .withName("heading1")
  .withDescription("heading1_desc")
  .withIcon(Heading1Icon)
  .withDetailedIcon(<HeadingIcon headingNumber={1} />)
  .withCategory("Typography")
  .withSearchTerms(["h1", "heading", "title"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/f88602b989484fff8a7122b25f03f67e?sid=2229c6f8-0bfb-42d2-a2c5-031c750341e5",
    description: "heading1_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 1 })
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setNode("heading", { level: 1 }).run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: "heading", attrs: { level: 1 } })
      .run();
  })
  .build();

export default Heading1;
