import { useEffect } from "react";
import useDraggedObject from "@/src/zustand/dragged-object";

export function useAdvancedDraggedObject(
  elements: any[],
  setElements: (elements: any[]) => void,
  draggableId: string,
  onComplete?: (items: any[]) => void,
) {
  const { result, setResult } = useDraggedObject();

  useEffect(() => {
    if (!result || typeof result !== "object") return;
    const { source, destination } = result;
    if (!destination) return;
    if (!result.draggableId.includes(draggableId)) return;
    const items = Array.from(elements);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder!);
    onComplete && onComplete(items);
    setElements(items);
    setResult(null);
  }, [result]);
}
