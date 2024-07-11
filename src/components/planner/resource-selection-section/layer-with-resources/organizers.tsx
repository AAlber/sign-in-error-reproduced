import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUsersOfInstitutionAndAvailabilityForTime } from "@/src/client-functions/client-appointment";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import Spinner from "@/src/components/spinner";
import UserDefaultImage from "@/src/components/user-default-image";
import type {
  OrganizerResource,
  PlannerLayerWithAvailableResources,
} from "@/src/types/planner/planner.types";
import usePlanner from "../../zustand";
import { ResourceWrapper } from "./resource-wrapper";

export default function OrganizerResourceSelector({
  layer,
}: {
  layer: PlannerLayerWithAvailableResources;
}) {
  const { removeResourceFromLayer, addResourceToLayer } = usePlanner();
  const { t } = useTranslation("page");

  const organizers = layer.resources.filter(
    (r) => r.type === "organizer",
  ) as OrganizerResource[];

  return (
    <ResourceWrapper
      title={t("planner.organizers.title")}
      description={t("planner.organizers.description")}
    >
      {organizers.map((u) => (
        <WithToolTip text={"general.remove"} key={u.id}>
          <Button
            className="flex items-center gap-2 font-normal"
            onClick={() => removeResourceFromLayer(u.id, layer.layer.id)}
          >
            {u.loadingUnavailabilities ? (
              <Spinner size="w-4 h-4" />
            ) : (
              <UserDefaultImage dimensions="w-4 h-4" user={u} />
            )}
            {u.name}
          </Button>
        </WithToolTip>
      ))}
      <AsyncSelect
        trigger={
          <Button
            variant={"ghost"}
            className={classNames(
              "flex items-center gap-1 font-normal",
              organizers.length === 0 && "-ml-0.5 pl-1 text-primary",
            )}
          >
            <Plus className="h-4 w-4" />
            {organizers.length === 0 && t("planner.add_organizer")}
          </Button>
        }
        filter={(item) => !organizers.some((r) => r.id === item.id)}
        fetchData={async () =>
          getUsersOfInstitutionAndAvailabilityForTime(new Date(), "10")
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
              type: "organizer",
              canFallback: true,
              fallbackOptions: ["swap-to-next-available"],
            },
            layer.layer.id,
          )
        }
      />
    </ResourceWrapper>
  );
}
