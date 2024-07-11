import { Droppable } from "react-beautiful-dnd";
import { useAdvancedDraggedObject } from "@/src/client-functions/client-utils/hooks/useAdvancedDraggedObject";
import { useEditor } from "../../../zustand";
import Page from "./page";

export default function PageList() {
  const { data, getPages, setPages } = useEditor();
  useAdvancedDraggedObject(getPages(), setPages, "workbench-page");

  return (
    <Droppable droppableId="workbench-page-list">
      {(provided) => (
        <ul
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="gap-2 pl-3"
        >
          {data.pages.map((page, index) => (
            <Page key={page.id} page={page} index={index} />
          ))}
        </ul>
      )}
    </Droppable>
  );
}
