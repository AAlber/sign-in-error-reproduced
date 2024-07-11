import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FC, HTMLAttributes } from "react";
import React from "react";
import Buttons from "./buttons";

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  withOpacity?: boolean;
  isDragging?: boolean;
  isInTheStore?: boolean;
};

const SortableItem: FC<ItemProps> = ({ isInTheStore, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="group">
      <div className="z-50 hidden justify-end transition-transform duration-300  group-hover:flex">
        <Buttons id={props.id} {...listeners} isInTheStore={isInTheStore!} />
      </div>
      <div className="relative z-40">{props.children}</div>
    </div>
  );
};

export default SortableItem;
