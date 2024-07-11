import { GripVertical, X } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  removeLayerFromMonitor,
  updateLayerPositions,
} from "@/src/client-functions/client-schedule-monitor";
import classNames from "@/src/client-functions/client-utils";
import { useAdvancedDraggedObject } from "@/src/client-functions/client-utils/hooks/useAdvancedDraggedObject";
import useInstitutionSettingsScheduleMonitor from "./zustand";

export default function MonitorLayerList() {
  const { layers, setLayers } = useInstitutionSettingsScheduleMonitor();
  useAdvancedDraggedObject(
    layers,
    setLayers,
    "monitor-layer-list-item",
    (items) => {
      updateLayerPositions(
        items.map((layer, index) => {
          return {
            id: layer.layerId,
            position: index,
          };
        }),
      );
    },
  );
  return (
    <Droppable droppableId="monitor-layer-list">
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ height: layers.length * 45 }}
          className={`divide-y divide-border`}
        >
          {layers.map((layer, index) => {
            return (
              <Draggable
                draggableId={`monitor-layer-list-item-${layer.layerId}`}
                index={index}
                key={layer.layerId}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    key={layer.layerId}
                    className={classNames(
                      "flex h-[45px] cursor-default items-center justify-between bg-foreground px-4",
                    )}
                  >
                    <div className="flex items-center">
                      <span
                        {...provided.dragHandleProps}
                        className="-ml-1 mr-2 inline-block cursor-move text-muted-contrast transition-colors hover:text-secondary"
                      >
                        <GripVertical className="size-5" />
                      </span>
                      <p className="text-sm text-contrast">
                        {layer.layer.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeLayerFromMonitor(layer.layerId)}
                    >
                      <X
                        size={20}
                        className="cursor-pointer text-muted-contrast hover:text-destructive"
                      />
                    </button>
                  </li>
                )}
              </Draggable>
            );
          })}
        </ul>
      )}
    </Droppable>
  );
}
