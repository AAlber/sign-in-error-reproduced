import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { dragEndFunctionality } from "@/src/client-functions/client-widgets";
import AddWidget from "./buttons/add-widget";
import WidgetComponent from "./widget-component";
import { widgets } from "./widgets";
import WidgetStore from "./widgets-store";
import useWidgetStore from "./zustand";

export default function Widgets() {
  const {
    widgetPosition,
    setWidgetPosition,
    widgetsOnDashboard,
    widgetsOnStore,
  } = useWidgetStore();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setWidgetPosition(
      widgetsOnDashboard.map((widget, index) => ({
        id: widget,
        position: index,
      })),
    );
  }, [widgetsOnStore]);

  const handleDragEnd = (event: DragEndEvent) => {
    dragEndFunctionality(event, widgetPosition, setWidgetPosition);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      id="dashboard"
    >
      <SortableContext
        items={widgetsOnDashboard}
        strategy={rectSortingStrategy}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {widgetsOnDashboard.map((id: string) => (
            <WidgetComponent
              key={id}
              widget={widgets.find((w) => w.identifier === id)!}
              isInTheStore={false}
            />
          ))}
          {widgetsOnDashboard.length >= 4 ? null : <AddWidget />}
        </div>
      </SortableContext>
      <DragOverlay adjustScale>
        {activeId && (
          <div className="h-full w-full rounded-lg border-2 border-dashed border-offwhite-3 dark:border-offblack-5 "></div>
        )}
      </DragOverlay>
      <WidgetStore />
    </DndContext>
  );
}
