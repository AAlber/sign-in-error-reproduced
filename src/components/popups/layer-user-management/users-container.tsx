import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type { UserWithAccess } from "@/src/types/user-management.types";
import { getUsersFromLayer } from "../../../client-functions/client-user-management";
import AsyncTable from "../../reusable/async-table";
import TruncateHover from "../../reusable/truncate-hover";
import UserDefaultImage from "../../user-default-image";
import LayerUserTableOptions from "./layer-user-table-options";
import UserManagementOptions from "./user-role-options";
import useUserLayerManagement from "./zustand";

export default function UsersContainer() {
  const { layerId, users, refresh, submittedFilter, setUsers } =
    useUserLayerManagement();
  const { t } = useTranslation("page");

  const baseColumns: ColumnDef<UserWithAccess>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          <TruncateHover
            text={row.original.name}
            truncateAt={30}
            className="text-contrast"
          />
        </div>
      ),
    },
    {
      id: "rolemenu",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-end">
          <UserManagementOptions user={row.original} layerId={layerId} />
        </div>
      ),
    },
  ];

  return (
    <div className="relative max-h-[700px] w-full overflow-scroll">
      <AsyncTable<UserWithAccess>
        promise={() =>
          getUsersFromLayer({
            layerId,
            filter: submittedFilter,
          })
        }
        data={users}
        setData={setUsers}
        refreshTrigger={JSON.stringify({ refresh, submittedFilter })}
        columns={baseColumns}
        styleSettings={{
          rowsPerPage: 10,
          additionalComponent: <LayerUserTableOptions />,
        }}
      />
    </div>
  );
}
