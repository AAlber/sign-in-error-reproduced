import TiptapTableRow from "@tiptap/extension-table-row";

const TableRow = TiptapTableRow.extend({
  allowGapCursor: false,
  content: "tableCell*",
});

export default TableRow;
