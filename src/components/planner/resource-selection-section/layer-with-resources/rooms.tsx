import { Plus, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getInstitutionRooms } from "@/src/client-functions/client-institution-room";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import Spinner from "@/src/components/spinner";
import UserDefaultImage from "@/src/components/user-default-image";
import type {
  PlannerLayerWithAvailableResources,
  RoomResource,
} from "@/src/types/planner/planner.types";
import useUser from "@/src/zustand/user";
import usePlanner from "../../zustand";
import { ResourceWrapper } from "./resource-wrapper";

export default function RoomResourceSelector({
  layer,
}: {
  layer: PlannerLayerWithAvailableResources;
}) {
  const { user } = useUser();
  const { removeResourceFromLayer, addResourceToLayer } = usePlanner();
  const { t } = useTranslation("page");

  if (!user.institution?.institutionSettings.addon_room_management) return null;

  const rooms = layer.resources.filter(
    (r) => r.type === "room",
  ) as RoomResource[];

  return (
    <ResourceWrapper
      title={t("planner.selection.rooms")}
      description={t("planner.selection.rooms.description")}
    >
      {rooms.map((r) => (
        <WithToolTip text={"general.remove"} key={r.id}>
          <Button
            className="flex items-center gap-2 font-normal"
            onClick={() => removeResourceFromLayer(r.id, layer.layer.id)}
          >
            {r.loadingUnavailabilities ? (
              <Spinner size="w-4 h-4" />
            ) : (
              <span className="flex items-center font-normal text-muted-contrast">
                <User className="mr-1 size-3.5" />
                {r.personCapacity}
              </span>
            )}
            <Separator orientation="vertical" />
            {r.name}
          </Button>
        </WithToolTip>
      ))}
      <AsyncSelect
        trigger={
          <Button
            variant={"ghost"}
            className={classNames(
              "flex items-center gap-1 font-normal",
              rooms.length === 0 && "-ml-0.5 pl-1 text-primary",
            )}
          >
            <Plus className="size-4" />
            {rooms.length === 0 && t("planner.add_room")}
          </Button>
        }
        filter={(item) => !rooms.some((r) => r.id === item.id)}
        fetchData={async () =>
          getInstitutionRooms(user.currentInstitutionId, "")
        }
        placeholder="general.search"
        noDataMessage="general.empty"
        searchValue={(item) => item.name + " " + item.id}
        itemComponent={(item) => (
          <span className="flex items-center gap-2">
            {" "}
            <UserDefaultImage dimensions="w-5 h-5" user={item} />
            {truncate(item.name ?? "", 30)}
          </span>
        )}
        onSelect={(item) =>
          addResourceToLayer(
            {
              ...item,
              type: "room",
              canFallback: true,
              fallbackOptions: [
                "swap-to-next-available",
                "switch-appointment-type",
              ],
            },
            layer.layer.id,
          )
        }
      />
    </ResourceWrapper>
  );
}
