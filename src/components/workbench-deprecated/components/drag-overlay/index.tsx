import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

type PropTypes = {
  element: any;
};

const DraggingOverlay = ({ element }: PropTypes) => {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: element.id,
  });

  const style = {
    cursor: "grabbing",
    transform: CSS.Translate.toString(transform),
  };

  const { t } = useTranslation("page");

  return (
    <li
      {...listeners}
      {...attributes}
      style={style}
      ref={setNodeRef}
      data-testid={`test_element_id`}
      className="flex aspect-square select-none flex-col items-center justify-center gap-2 rounded-md border border-primary bg-background p-2 text-xs text-contrast"
    >
      <div>{element.icon}</div>
      <div>{t(element.name)}</div>
    </li>
  );
};

export default DraggingOverlay;
