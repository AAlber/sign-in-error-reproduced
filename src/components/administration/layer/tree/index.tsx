import type {
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DndKitOptions } from "@/src/client-functions/client-administration/dnd-kit-operations";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import useAdministration from "@/src/components/administration/zustand";
import type { Layer } from "../../types";
import { SortableTreeItem } from "./sortable-tree-item";

const indentationWidth = 50;

const LayerTree = () => {
  const { layerTree_ = [] } = useAdministration();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const options = useMemo(() => DndKitOptions, []);

  const flattenedItems = useMemo(
    () => structureHandler.utils.layerTree.getFlattenedItems(activeId),
    [activeId, JSON.stringify(layerTree_)],
  );

  const projected =
    activeId && overId
      ? structureHandler.utils.dndKit.getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null;

  const sensors = useSensors(useSensor(PointerSensor));

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    /**
     * Rebuild the rootFlatTree if there is a change
     * in any of the children of the layerTree, we use this for
     * the breadCrumbs
     */
    structureHandler.utils.layerTree.rebuildRootFlatLayer();
  }, [JSON.stringify(layerTree_)]);

  useEffect(() => {
    /**
     * Set all layers folded by default if zustand state is fresh.
     * Zustand state "can" be fresh if there are no unfolded layers in state
     */
    const layers = structureHandler.utils.layerTree.flattenTree(layerTree_);

    const hasMutatedState = layers.some((i) => i.collapsed);
    if (!hasMutatedState) {
      layers.forEach((i) => {
        structureHandler.utils.layerTree.handleCollapse(i.id, true);
      });
    }
  }, []);

  const resetState = () => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    document.body.style.setProperty("cursor", "");
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragStart = ({ active: { id: activeId } }: DragStartEvent) => {
    setActiveId(activeId);
    setOverId(activeId);
    document.body.style.setProperty("cursor", "grabbing");
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  };

  const handleDragEnd_ = structureHandler.utils.layerTree.handleDragEnd(
    projected,
    resetState,
    structureHandler.update.layerPosition,
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      measuring={options.measuring}
      onDragCancel={resetState}
      onDragEnd={handleDragEnd_}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map((item) => {
          const { id, children, collapsed, depth } = item;
          const depth_ = id === activeId && projected ? projected.depth : depth;

          return (
            <SortableTreeItem
              collapsed={Boolean(collapsed && children.length)}
              depth={depth_}
              id={id}
              indentationWidth={indentationWidth}
              key={id}
              layer={item as Layer}
            />
          );
        })}

        {/* Create the Drag Overlay and mount to document body */}

        {createPortal(
          <DragOverlay
            dropAnimation={options.dropAnimationConfig}
            modifiers={[structureHandler.utils.dndKit.adjustTranslate]}
          >
            {activeId && activeItem ? (
              <SortableTreeItem
                clone
                depth={activeItem.depth}
                id={activeId}
                indentationWidth={indentationWidth}
                layer={activeItem as Layer}
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );
};

export default LayerTree;
