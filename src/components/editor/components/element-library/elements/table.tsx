import { createTable } from "@tiptap/extension-table";
import { TableIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { TableIcon as TableDetailedIcon } from "./detailed-icons";

const Table = new ElementBuilder()
  .withName("table")
  .withDescription("table_desc")
  .withIcon(TableIcon)
  .withDetailedIcon(<TableDetailedIcon />)
  .withCategory("Typography")
  .withSearchTerms(["table", "tb"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/99389ac22bd04582a17483ac2f643b36?sid=0d048bf2-23f7-4c61-a590-f2515645c9c7",
    description: "table_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
      .run();
  })
  .withOnClickCommand(({ editor }) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
      .run();
  })
  .withDropCommand(({ editor, pos }) => {
    const node = createTable(editor.schema, 3, 3, false);
    editor.chain().focus().insertContentAt(pos, node.content.toJSON()).run();
  })
  .build();

export default Table;
