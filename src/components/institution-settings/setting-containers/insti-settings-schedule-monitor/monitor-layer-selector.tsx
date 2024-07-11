import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { addLayerToMonitor } from "@/src/client-functions/client-schedule-monitor";
import AsyncSelect from "@/src/components/reusable/async-select";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import LayerSelectPathHoverCard from "@/src/components/reusable/layer-select-path-card";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { toast } from "@/src/components/reusable/toaster/toast";
import useInstitutionSettingsScheduleMonitor from "./zustand";

export default function MonitorLayerSelector() {
  const { layers } = useInstitutionSettingsScheduleMonitor();

  return (
    <div className="mb-2 flex w-full items-center justify-end">
      <div className="w-auto">
        <AsyncSelect
          fetchData={structureHandler.get.layersUserHasSpecialAccessTo}
          onSelect={(layer) => {
            if (!layer) return;
            if (layers.some((layer) => layer.layerId === layer.id))
              return toast.warning(
                "toast.org_settings_warning_layer_already_added",
                {
                  description:
                    "toast.org_settings_warning_layer_already_added_description",
                },
              );
            addLayerToMonitor(layer.id);
          }}
          trigger={<Button>Add Layer</Button>}
          openWithShortcut={false}
          noDataMessage="general.empty"
          placeholder="general.search"
          itemComponent={(layer) => (
            <p className="flex items-center gap-2 font-medium text-contrast">
              <AutoLayerCourseIconDisplay
                course={layer.course}
                className="h-5 w-5"
              />

              <span>{layer.name}</span>
            </p>
          )}
          searchValue={(layer) => layer.name + " " + layer.id}
          renderHoverCard={true}
          hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
        />
      </div>
    </div>
  );
}
