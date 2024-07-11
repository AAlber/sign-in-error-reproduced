import type { Row } from "@tanstack/react-table";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

export type UserCustomFieldCellProps = {
  id: string;
  header: string;
  cell: ({ row }: { row: Row<InstitutionUserManagementUser> }) => JSX.Element;
  columnSize: number;
};

export type UserManagementDataFields = Record<string, string>;

export const QUERY_KEY_USERS_OF_INSTITUTION = ["getAllUsersOfInstitution"];
