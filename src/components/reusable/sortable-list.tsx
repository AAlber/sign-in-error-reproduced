import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { forwardRef } from "react";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "./shadcn-ui/button";

type SortableListProps<T> = {
  items: T[];
  setItems: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  onSort?: (newItems: T[]) => void;
  className?: string;
  itemClassName?: string;
  onRemove?: (item: T, index: number) => void;
};

function SortableList<T extends { id: string }>({
  items,
  setItems,
  renderItem,
  onSort,
  className,
  itemClassName,
  onRemove,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onSort?.(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className={classNames(
            "relative w-full divide-y divide-border",
            className,
          )}
        >
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              index={index}
              renderItem={renderItem}
              onRemove={onRemove}
              itemClassName={itemClassName}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
SortableList.displayName = "SortableList";

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, style, ...props }, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} style={style} {...props}>
        {id}
      </div>
    );
  },
);
Item.displayName = "Item";

export function SortableItem({
  id,
  item,
  index,
  renderItem,
  itemClassName,
  onRemove,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={classNames(itemClassName, "flex items-center")}
      {...attributes}
    >
      <Button
        variant={"ghost"}
        size={"icon"}
        {...listeners}
        className="mx-2 cursor-grab"
      >
        <GripVertical className="h-5 w-5 text-muted-contrast hover:text-contrast" />
      </Button>
      {renderItem(item, index)}
      {onRemove && (
        <button onClick={() => onRemove(item, index)}>Remove</button>
      )}
    </li>
  );
}
SortableItem.displayName = "SortableItem";

export default SortableList;
