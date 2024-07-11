import type { ColumnDef } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import {
  createRole,
  getAdminsOfInstitution,
  removeRole,
} from "@/src/client-functions/client-user-management";
import AsyncSelect from "@/src/components/reusable/async-select";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import Spinner from "../../spinner";
import AsyncTable from "../async-table";
import { AutoLayerCourseIconDisplay } from "../course-layer-icons";
import LayerSelectPathHoverCard from "../layer-select-path-card";
import { Button } from "../shadcn-ui/button";
import TruncateHover from "../truncate-hover";

export default function UserAccessTable({
  user,
}: {
  user: InstitutionUserManagementUser;
}) {
  const { t } = useTranslation("page");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<string[]>([]);
  const [layers, setLayers] = useState<LayerUserHasAccessTo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const columns: ColumnDef<LayerUserHasAccessTo>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: () => {
        return <div className="ml-1 flex items-center">{t("name")}</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ml-1 flex items-center gap-2">
            <AutoLayerCourseIconDisplay
              course={row.original.course}
              className="h-5 w-5"
            />
            <TruncateHover text={row.original.name} truncateAt={30} />
          </div>
        );
      },
    },
    {
      id: "role",
      accessorKey: "role",
      header: () => {
        return <div>{t("role")}</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="ml-1 flex items-center gap-2">
            {t(row.original.role)}
          </div>
        );
      },
    },
    {
      id: "menu",
      header: () => {
        if (isAdmin) return null;
        return (
          <div className="ml-2 flex items-center justify-end">
            <AsyncSelect
              fetchData={structureHandler.get.layersUserHasSpecialAccessTo}
              onSelect={async (layer) => {
                if (!layer) return;
                if (!hasActiveSubscription()) return toastNoSubscription();
                await createRole({
                  userId: user.id,
                  layerId: layer.id,
                  role: "member",
                });
                setRefreshTrigger(refreshTrigger + 1);
              }}
              trigger={
                <Button variant={"ghost"} size={"iconSm"}>
                  <Plus className="h-4 w-4 text-primary" />
                </Button>
              }
              renderHoverCard={true}
              hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
              filter={(layer) => !layers.map((l) => l.id).includes(layer.id)}
              noDataMessage="general.empty"
              placeholder="general.search"
              itemComponent={(layer) => (
                <div className="flex items-center gap-2">
                  {" "}
                  <AutoLayerCourseIconDisplay
                    course={layer.course}
                    className="h-5 w-5"
                  />
                  {layer.name}
                </div>
              )}
              searchValue={(layer) => layer.name + " " + layer.id}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex h-5 items-center justify-end">
            <Button
              className="group"
              size={"iconSm"}
              variant={"ghost"}
              onClick={async () => {
                setDeleteLoading([...deleteLoading, row.original.id]);
                const success = await removeRole({
                  userId: user.id,
                  layerId: row.original.id,
                });
                setDeleteLoading(
                  deleteLoading.filter((id) => id !== row.original.id),
                );
                if (success) setRefreshTrigger(refreshTrigger + 1);
              }}
            >
              {deleteLoading.includes(row.original.id) ? (
                <Spinner size="h-4 w-4" />
              ) : (
                <X className="h-4 w-4 text-muted-contrast group-hover:text-destructive" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AsyncTable
      data={layers}
      setData={setLayers}
      promise={async () => {
        const users = await getAdminsOfInstitution();
        if (users.map((u) => u.id).includes(user.id)) {
          setIsAdmin(true);
          return Promise.resolve([]);
        } else {
          return await structureHandler.get.topMostLayersUserHasAccessTo(
            user.id,
          );
        }
      }}
      columns={columns}
      refreshTrigger={refreshTrigger}
      styleSettings={{
        height: 265,
        emptyState: isAdmin && (
          <div className="mx-10 my-5 flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-contrast">{t("user_is_admin")}</p>
            <p className="text-sm text-muted-contrast">
              {t("user_is_admin_description")}
            </p>
          </div>
        ),
      }}
    />
  );
}
