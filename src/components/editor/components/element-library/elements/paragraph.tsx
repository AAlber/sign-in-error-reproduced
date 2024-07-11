import { TextIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { ParagraphIcon } from "./detailed-icons";

const Text = new ElementBuilder()
  .withName("text")
  .withDescription("text_desc")
  .withIcon(TextIcon)
  .withDetailedIcon(<ParagraphIcon />)
  .withCategory("Typography")
  .withSearchTerms(["text", "paragraph", "p"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/4703cb5774a8446192a2de85105faaa9?sid=2099ee03-bbf9-44ef-896d-b2d42f688667",
    description: "text_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode("paragraph", "paragraph")
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().toggleNode("paragraph", "paragraph").run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor.chain().focus().insertContentAt(pos, { type: "paragraph" }).run();
  })
  .build();

export default Text;
