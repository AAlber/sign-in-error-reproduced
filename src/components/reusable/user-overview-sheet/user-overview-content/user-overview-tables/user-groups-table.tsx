import type { InstitutionUserGroup } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getGroupsOfUser,
  removeUsersFromUserGroups,
} from "@/src/client-functions/client-institution-user-groups";
import Spinner from "../../../../spinner";
import AsyncTable from "../../../async-table";
import { Button } from "../../../shadcn-ui/button";
import TruncateHover from "../../../truncate-hover";
import { useUserOverview } from "../../zustand";

export default function UserGroupsTable() {
  const { t } = useTranslation("page");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<string[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const { user } = useUserOverview();
  if (!user) return null;

  const columns: ColumnDef<InstitutionUserGroup & { memberSince: string }>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: () => {
        return <div className="ml-1 flex items-center">{t("name")}</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ml-1 flex items-center gap-2">
            <TruncateHover text={row.original.name} truncateAt={30} />
          </div>
        );
      },
    },
    {
      id: "memberSince",
      accessorKey: "memberSince",
      header: () => {
        return (
          <div className="ml-1 flex items-center">{t("member_since")}</div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="ml-1 flex items-center gap-2">
            {dayjs(row.original.memberSince).format("DD MMM YYYY")}
          </div>
        );
      },
    },
    {
      id: "menu",
      cell: ({ row }) => {
        return (
          <div className="flex h-5 items-center justify-end">
            <Button
              className="group"
              size={"iconSm"}
              variant={"ghost"}
              onClick={async () => {
                setDeleteLoading([...deleteLoading, row.original.id]);
                const response = await removeUsersFromUserGroups(
                  [user.id],
                  [row.original.id],
                );
                setDeleteLoading(
                  deleteLoading.filter((id) => id !== row.original.id),
                );
                if (response.ok) setRefreshTrigger(refreshTrigger + 1);
              }}
            >
              {deleteLoading.includes(row.original.id) ? (
                <Spinner size="h-4 w-4" />
              ) : (
                <X className="h-4 w-4 group-hover:text-destructive" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <AsyncTable
        promise={() => getGroupsOfUser(user.id)}
        columns={columns}
        data={groups}
        setData={setGroups}
        refreshTrigger={refreshTrigger}
        styleSettings={{
          height: 265,
        }}
      />
    </div>
  );
}
