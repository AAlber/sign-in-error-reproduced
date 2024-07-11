import { Plus } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import AsyncSelect from "@/src/components/reusable/async-select";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import LayerSelectPathHoverCard from "@/src/components/reusable/layer-select-path-card";
import useAppointmentEditor from "../zustand";

export default function AppointmentLayerSelector() {
  const { layerIds, setLayerIds } = useAppointmentEditor();

  return (
    <AsyncSelect
      fetchData={structureHandler.get.layersUserHasSpecialAccessTo}
      trigger={<Plus className="h-4 w-4 text-primary" />}
      openWithShortcut={false}
      searchValue={(item) => item.name + " " + item.id}
      itemComponent={(layer) => (
        <p className="flex items-center gap-2 font-medium text-contrast">
          <AutoLayerCourseIconDisplay
            course={layer.course}
            className="h-5 w-5"
          />

          <span>{layer.name}</span>
        </p>
      )}
      noDataMessage="general.empty"
      placeholder="general.search"
      renderHoverCard={true}
      hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
      filter={(item) => !layerIds.includes(item.id)}
      onSelect={(item) => setLayerIds([...layerIds, item.id])}
    />
  );
}
