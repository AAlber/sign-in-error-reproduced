import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { ElementBehaviourType, ElementType } from "../elements/element-type";
import elementTypes from "../elements/element-types";
import CommentSection from "../elements/misc/comment-section";
import type { WorkbenchElement } from "../types";
import useWorkbench, { WorkbenchMode } from "../zustand";
import WorkbenchElementOptions from "./workbench-element-options";

export default function Element({
  element,
  idx,
}: {
  element: WorkbenchElement;
  idx: number;
}) {
  const { mode } = useWorkbench();
  const type = elementTypes.find((e) => e.id === element.type)!;
  const { isOver, setNodeRef } = useDroppable({
    id: element.id,
  });
  const style = {
    opacity: isOver ? 1 : 0,
  };
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  return (
    <Draggable draggableId={`workbench-element-${element.id}`} index={idx}>
      {(provided) => (
        <div
          onMouseEnter={handleHover}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="h-[1.5px] w-full bg-primary"
            ref={setNodeRef}
            style={style}
          ></div>
          <div
            key={element.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`${
              type.id !== ElementType.IMAGE &&
              type.id !== ElementType.ATTACHMENT &&
              type.id !== ElementType.VIDEO &&
              type.id !== ElementType.VIMEO &&
              !(
                type.id === ElementType.PARAGRAPH &&
                mode === WorkbenchMode.CREATE
              ) &&
              "px-4 py-3"
            } group relative my-2 w-full rounded-lg border border-border bg-foreground`}
          >
            <div className="flex items-start">
              {mode === WorkbenchMode.CREATE && (
                <WorkbenchElementOptions
                  element={element}
                  provided={provided}
                  isHovering={isHovered}
                />
              )}
              {mode !== WorkbenchMode.CREATE && <div className="" />}
              {type.component(element.id)}
            </div>
            {type.behaviourType === ElementBehaviourType.INTERACTIVE && (
              <CommentSection elementId={element.id} />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
