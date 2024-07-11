import { Filter } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import LayerSelectPathHoverCard from "@/src/components/reusable/layer-select-path-card";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import useInstitutionUserManagementFilter from "./zustand";

interface DataTableLayerFilterProps {
  title?: string;
}

export function AccessFilter({ title }: DataTableLayerFilterProps) {
  const { filteredLayers, setFilteredLayers } =
    useInstitutionUserManagementFilter();

  return (
    <AsyncSelect
      side="bottom"
      trigger={
        <Button
          variant="outline"
          size="small"
          className="h-8 border-dashed text-contrast"
        >
          <Filter className="mr-2 h-4 w-4 text-muted-contrast" />
          {title}
          {filteredLayers.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="default"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filteredLayers.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {filteredLayers.length > 2 ? (
                  <Badge
                    variant="default"
                    className="rounded-sm bg-accent px-1 font-normal"
                  >
                    {filteredLayers.length} selected
                  </Badge>
                ) : (
                  filteredLayers
                    .filter((option) => filteredLayers.includes(option))
                    .map((option) => (
                      <Badge
                        variant="default"
                        key={option.id}
                        className="rounded-sm border border-accent bg-accent px-1 font-normal "
                      >
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      }
      openWithShortcut={false}
      placeholder="general.search"
      noDataMessage="general.empty"
      fetchData={structureHandler.get.layersUserHasSpecialAccessTo}
      filter={(layer) => !filteredLayers.includes(layer)}
      onSelect={(item) => {
        const layerIdx = filteredLayers.findIndex(
          (layer) => layer.id === item.id,
        );

        if (layerIdx === -1) setFilteredLayers([...filteredLayers, item]);
        else {
          const clone = [...filteredLayers];
          clone.splice(layerIdx, 1);
          setFilteredLayers(clone);
        }
      }}
      renderHoverCard={true}
      hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
      searchValue={(item) => item.name + " " + item.id}
      itemComponent={(item) => (
        <div className="flex w-full items-center justify-between">
          <p className="flex w-full items-center gap-2">
            <AutoLayerCourseIconDisplay
              course={item.course}
              className="h-5 w-5"
            />
            <span>{truncate(item.name ?? "", 20)}</span>
          </p>
        </div>
      )}
    />
  );
}
