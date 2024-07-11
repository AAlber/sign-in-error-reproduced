import type { DragEventHandler } from "react";
import { useEffect, useState } from "react";

/**
 * Simple reusable hook which abstracts boiler plate of setting up dragAndDrop listeners for different components
 *
 * Currently used in:
 * 1. SimpleFileUpload
 * 2. DragAndDrop files to Chat
 */
export const useDragAndDropHandlers = () => {
  const [dragActive, setDragActive] = useState(false);

  const preventDefault = (e: Event | React.DragEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    // disable window from opening file in new tab onDrop
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const onDragEnter: DragAndDropHandlerType["onDragEnter"] = (e) => {
    preventDefault(e);
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const onDragLeave: DragAndDropHandlerType["onDragLeave"] = (e) => {
    preventDefault(e);
    setDragActive(false);
  };

  const onDrop: DragAndDropHandlerType["onDrop"] = (e) => {
    preventDefault(e);
    setDragActive(false);

    return e.dataTransfer.files;
  };

  return { dragActive, onDragEnter, onDragLeave, onDrop };
};

export type DragAndDropHandlerType = {
  dragActive: boolean;
  onDragEnter: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDrop: (e: Parameters<DragEventHandler>["0"]) => FileList;
};
