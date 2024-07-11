import type { Invite } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { AdminDashInstitution } from "@/src/utils/stripe-types";
import AsyncTable from "../../../../reusable/async-table";
import { isAdminDashTestInstitution } from "../..";
import { useAdminDash } from "../../zustand";
import { EmailPopover } from "../email-popover";

export const AdminDashInviteOverview = function AdminDashInviteOverview({
  adminDashInstitution,
  invitations,
}: {
  adminDashInstitution?: AdminDashInstitution;
  invitations: Invite[];
}) {
  const { key } = useAdminDash();
  const columns: ColumnDef<Invite>[] = [
    {
      id: "email",
      accessorKey: "email",
      header: "email",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.index + 1}. {row.original.email || "No email"}
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
    {
      id: "sent on",
      accessorKey: "sent on",
      header: "sent on",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.original.createdAt
            ? dayjs(row.original.createdAt).format("DD. MM. YYYY")
            : "No Date"}
        </p>
      ),
    },
  ];

  return (
    <AsyncTable<Invite>
      promise={() => {
        return Promise.resolve(invitations);
      }}
      key={key}
      columns={columns}
      styleSettings={{
        showSearchBar: false,
        rowsPerPage: 50,
        additionalComponent: adminDashInstitution &&
          isAdminDashTestInstitution(adminDashInstitution.subscription) && (
            <div className="flex w-full justify-between">
              <div className="text-xl font-semibold">Invitations</div>
              <div className="flex items-center gap-2">
                <EmailPopover
                  institutionId={adminDashInstitution.institution.id}
                >
                  <div className="mr-2 text-sm font-semibold">
                    Send Admin Invite
                  </div>
                </EmailPopover>
              </div>
            </div>
          ),
      }}
    />
  );
};
