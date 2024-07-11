import type { ColumnDef, Row } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

type UserRowCellProps = {
  id: string;
  header: string;
  columnSize: number;
  cell: ({ row }: { row: Row<InstitutionUserManagementUser> }) => JSX.Element;
};

export default function UserRowCell(
  props: UserRowCellProps,
): ColumnDef<InstitutionUserManagementUser> {
  const { t } = useTranslation("page");

  return {
    id: props.id,
    accessorKey: props.header,
    size: props.columnSize,
    header: () => {
      return <div className="flex items-center">{t(props.header)}</div>;
    },
    cell: ({ row }) => row.original.email,
  };
}
