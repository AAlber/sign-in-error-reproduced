import { useDraggable } from "@dnd-kit/core";
import type { Editor } from "@tiptap/react";
import { Element } from "./element";
import type { RegisteredElement } from "./registry";

interface Props {
  element: RegisteredElement;
  onHelpClick: (element: RegisteredElement) => void;
  editor: Editor;
}

export const DraggableElement = ({ element, editor, onHelpClick }: Props) => {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: element.name,
  });

  const style = {
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <Element
      onHelpClick={onHelpClick}
      element={element}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        element.onClick({ editor });
      }}
    />
  );
};
