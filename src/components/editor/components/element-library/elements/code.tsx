import { CodeIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { CodeIcon as CodeDetailedIcon } from "./detailed-icons";

const CodeBlock = new ElementBuilder()
  .withName("code-block")
  .withDescription("code-block_desc")
  .withIcon(CodeIcon)
  .withDetailedIcon(<CodeDetailedIcon />)
  .withCategory("Technical")
  .withSearchTerms(["code", "programming", "code-block", "code-snippet"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/89e47d497bfc44e58664b2353ecf206e?sid=de91c3b3-43e5-4770-9ab0-aaaf5219b434",
    description: "code-block_help",
  })
  .withSlashCommand("Format", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().toggleCodeBlock().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor.chain().focus().insertContentAt(pos, { type: "codeBlock" }).run();
  })
  .build();

export default CodeBlock;
