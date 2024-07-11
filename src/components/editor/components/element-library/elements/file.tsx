import { FileUp } from "lucide-react";
import { ElementBuilder } from "../registry";
import { FileIcon } from "./detailed-icons";

const File = new ElementBuilder()
  .withName("file")
  .withDescription("file_desc")
  .withIcon(FileUp)
  .withDetailedIcon(<FileIcon />)
  .withCategory("Media")
  .withSearchTerms(["file", "image"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/bcd0610e3ea2495fa963730edff10fa0?sid=912cd699-0795-41b4-8259-ab2406cccd56",
    description: "file_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setFileUpload().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setFileUpload().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor.chain().focus().insertContentAt(pos, { type: "fileUpload" }).run();
  })
  .build();

export default File;
