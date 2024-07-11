import { Droppable } from "react-beautiful-dnd";
import { useAdvancedDraggedObject } from "@/src/client-functions/client-utils/hooks/useAdvancedDraggedObject";
import useWorkbench from "../../zustand";
import WBPageItem from "./page-item";

export default function WBPageList() {
  const { content, getPages, setPages } = useWorkbench();
  useAdvancedDraggedObject(getPages(), setPages, "workbench-page");

  return (
    <Droppable droppableId="workbench-page-list">
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="gap-2 pl-3"
        >
          {content.pages.map((page, index) => (
            <WBPageItem key={page.id} page={page} index={index} />
          ))}
        </ul>
      )}
    </Droppable>
  );
}
