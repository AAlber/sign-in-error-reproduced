import type { ColumnDef } from "@tanstack/react-table";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import Cell from "./cell";
import Header from "./header";
import type { UserCustomFieldCellProps } from "./types";

type Props = Omit<UserCustomFieldCellProps, "cell">;

export default function UserCustomField({
  id,
  header,
  columnSize,
}: Props): ColumnDef<InstitutionUserManagementUser> {
  return {
    id,
    accessorKey: header,
    size: columnSize,
    header: () => <Header header={header} id={id} />,
    cell: ({ row }) => <Cell fieldId={id} row={row} />,
  };
}
