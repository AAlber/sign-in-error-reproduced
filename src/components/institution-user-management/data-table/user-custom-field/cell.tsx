import type { CoreRow } from "@tanstack/react-table";
import React from "react";
import { useFormContext } from "react-hook-form";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import type { UserManagementDataFields } from "./types";

type Props = {
  fieldId: string;
  row: CoreRow<InstitutionUserManagementUser>;
};

export default function Cell({ row, fieldId }: Props) {
  const { register } = useFormContext<UserManagementDataFields>();
  const fieldName = `${fieldId}__${row.original.id}`; // Unique name for each cell
  return (
    <div className="flex w-52 items-center">
      <input
        {...register(fieldName)}
        className="border-0 bg-transparent text-contrast outline-0 ring-0"
      />
    </div>
  );
}
