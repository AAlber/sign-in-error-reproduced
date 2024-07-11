import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "../../reusable/async-select";
import { AutoLayerCourseIconDisplay } from "../../reusable/course-layer-icons";
import { Button } from "../../reusable/shadcn-ui/button";
import usePlanner from "../zustand";

export default function LayerSelector({
  onSelect,
}: {
  onSelect: (layerId: string) => void;
}) {
  const { layers, addLayer } = usePlanner();
  const { t } = useTranslation("page");

  const hasLayers = layers.length > 0;

  return (
    <AsyncSelect
      side="bottom"
      trigger={
        <div>
          <Button
            variant={!hasLayers ? "cta" : "ghost"}
            className="font-normal"
          >
            <Plus className="mr-1 h-4 w-4" />
            {!hasLayers
              ? t("add_course_or_layer")
              : t("add_another_course_or_layer")}
          </Button>
        </div>
      }
      fetchData={async () =>
        structureHandler.get.layersUserHasSpecialAccessTo()
      }
      placeholder="general.search"
      noDataMessage="general.empty"
      searchValue={(item) => item.name + " " + item.id}
      itemComponent={(item) => (
        <p className="flex w-full items-center gap-2">
          <AutoLayerCourseIconDisplay
            course={item.course}
            className="h-5 w-5"
          />
          <span> {truncate(item.name ?? "", 30)}</span>
        </p>
      )}
      onSelect={(item) => {
        addLayer({
          layer: {
            ...item,
            canFallback: false,
            type: "layer",
          },
          resources: [],
        });
        onSelect(item.id);
      }}
    />
  );
}
