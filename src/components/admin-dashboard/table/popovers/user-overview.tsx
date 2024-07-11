import type { ColumnDef } from "@tanstack/react-table";
import api from "@/src/pages/api/api";
import type { UserWithAccess } from "@/src/types/user-management.types";
import AsyncTable from "../../../reusable/async-table";
import { useAdminDash } from "../zustand";

export function AdminDashUserOverview({
  institutionId,
}: {
  institutionId: string;
}) {
  const { adminDashPassword } = useAdminDash();
  const columns: ColumnDef<UserWithAccess>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "name",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.index + 1}. {row.original.name}
        </p>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.index + 1}. {row.original.email}
        </p>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "role",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">{row.original.role}</p>
      ),
    },
  ];

  async function getUserOverview(
    adminDashPassword: string,
    institutionId: string,
  ) {
    const res = await fetch(
      api.adminDashGetUserOverview +
        "?adminDashPassword=" +
        adminDashPassword +
        "&institutionId=" +
        institutionId,
      {
        method: "GET",
      },
    );
    const data = await res.json();
    return data;
  }

  return (
    <AsyncTable<UserWithAccess>
      promise={() => getUserOverview(adminDashPassword, institutionId)}
      columns={columns}
      styleSettings={{
        showSearchBar: false,
        rowsPerPage: 50,
      }}
    />
  );
}
