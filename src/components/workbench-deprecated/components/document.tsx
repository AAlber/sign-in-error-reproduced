import { useEffect, useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useAdvancedDraggedObject } from "@/src/client-functions/client-utils/hooks/useAdvancedDraggedObject";
import { updateThumbnail } from "@/src/client-functions/client-workbench";
import { ElementType } from "../elements/element-type";
import useWorkbench, { WorkbenchMode } from "../zustand";
import MainDropzone from "./main-dropzone";
import Element from "./workbench-element-component";

export default function WBDocument() {
  const {
    setElements,
    getElementsOfCurrentPage,
    getCurrentPage,
    open,
    mode,
    updatePageThumbnail,
  } = useWorkbench();

  const currentPage = getCurrentPage();
  const elementsOfCurrentPage = getElementsOfCurrentPage();
  const ref = useRef(null);
  useAdvancedDraggedObject(
    elementsOfCurrentPage,
    setElements,
    "workbench-element",
  );

  useEffect(() => {
    if (!open || mode !== WorkbenchMode.CREATE) return;
    updateThumbnail(currentPage);
  }, [elementsOfCurrentPage]);

  useEffect(() => {
    updatePageThumbnail(currentPage.id, "");
    return () => {
      // TODO: Prepare thumbnail for external store here
    };
  }, [currentPage.id]);

  return (
    <Droppable droppableId="workbench-elements-droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex grow items-start justify-center"
        >
          <div className="mx-4 size-full max-w-[1200px] grow overflow-x-scroll">
            <div
              id={`document-${currentPage.id}-workbench`}
              ref={ref}
              className="my-4 p-10"
            >
              <div
                data-testid="drop-body-elements"
                className={`${mode === WorkbenchMode.CREATE && "min-h-full"}`}
              >
                {elementsOfCurrentPage
                  .filter((element) => {
                    if (
                      mode !== WorkbenchMode.CREATE &&
                      element.type === ElementType.MAGICTASK
                    )
                      return false;
                    return true;
                  })
                  .map((element, idx) => (
                    <Element key={element.id} element={element} idx={idx} />
                  ))}
                {mode === WorkbenchMode.CREATE && <MainDropzone />}
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}
