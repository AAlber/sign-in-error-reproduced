import type { ColumnDef } from "@tanstack/react-table";
import type { ImportUserFieldType } from "./schema";

export const createColumns: (
  extraFields: string[],
) => ColumnDef<ImportUserFieldType>[] = (extraFields) => {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
  ].concat(
    extraFields.map((i) => ({
      accessorKey: i,
      header: i.toUpperCase(),
    })),
  );
};
