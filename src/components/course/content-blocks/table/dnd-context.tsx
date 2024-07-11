import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useMemo, useState } from "react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { updateRequirementsAndSortContentBlocks } from "@/src/client-functions/client-contentblock/utils";
import { deepCopy } from "@/src/client-functions/client-utils";
import { toast } from "@/src/components/reusable/toaster/toast";
import useCourse from "../../zustand";
import type { DndTableProps } from "./dnd-table";
import DndTableRowOverlay from "./dnd-table-row-overlay";

type Props = React.PropsWithChildren<DndTableProps>;

export default function TableDndContext({ children, items }: Props) {
  const { contentBlocks, setSearch, setContentBlocks, course } = useCourse();
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const overlayBlock = useMemo(() => {
    return contentBlocks.find((block) => block.id === activeId);
  }, [activeId]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setSearch("");
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.id && active.id !== over.id) {
      const clone = deepCopy(contentBlocks);
      const oldIndex = items.findIndex((i) => i === active.id);
      const newIndex = items.findIndex((i) => i === over.id);
      const newBlockPositions = arrayMove(contentBlocks, oldIndex, newIndex);
      const blocks = updateRequirementsAndSortContentBlocks(newBlockPositions);

      setContentBlocks(blocks);

      try {
        contentBlockHandler.update.order({
          layerId: course.layer_id ?? "",
          contentBlocks: blocks.map((block, idx) => ({
            ...block,
            position: idx,
            // we only need to send requirementId
            requirements: block.requirements.map(({ id }) => id),
          })),
        });
      } catch (e) {
        setContentBlocks(clone);
        toast.responseError({
          title: "Something went wrong",
          response: new Response(),
        });
      }
    }

    setActiveId(undefined);
  };

  const handleDragCancel = () => {
    setActiveId(undefined);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      {children}
      <DragOverlay>
        <DndTableRowOverlay block={overlayBlock} />
      </DragOverlay>
    </DndContext>
  );
}
