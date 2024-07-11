import { Columns as ColumnsIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { ColumnsIcon as ColumnsDetailedIcon } from "./detailed-icons";

const Columns = new ElementBuilder()
  .withName("columns")
  .withDescription("columns_desc")
  .withIcon(ColumnsIcon)
  .withDetailedIcon(<ColumnsDetailedIcon />)
  .withCategory("Typography")
  .withSearchTerms(["columns"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/9bcf887e9a5e4c6281546ff1326ec3d7?sid=12c020b1-8e65-4a0c-81ec-3d73f1caf7ae",
    description: "columns_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setColumns().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setColumns().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(pos, {
        type: "columns",
        content: [
          {
            type: "column",
            content: [
              {
                type: "paragraph",
              },
            ],
          },
          {
            type: "column",
            content: [
              {
                type: "paragraph",
              },
            ],
          },
        ],
      })
      .run();
  })
  .build();

export default Columns;
