import cuid from "cuid";
import api from "../../pages/api/api";
import useCourse from "../course/zustand";
import useConfirmationModal from "../popups/confirmation-modal/zustand";
import { toast } from "../reusable/toaster/toast";
import type { WorkbenchElementType } from "./elements/element-type";
import elementTypes from "./elements/element-types";
import useWorkbench, { WorkbenchMode, WorkbenchType } from "./zustand";

export function getUserDocument(userId, userDocuments) {
  return userDocuments.filter((doc) => doc.userId === userId).at(0);
}

export function isSubmitted(userId, userDocuments): boolean {
  try {
    return getUserDocument(userId, userDocuments).status === 2;
  } catch (e) {
    return false;
  }
}

export function getContent(userId, userDocuments) {
  return JSON.parse(getUserDocument(userId, userDocuments).content);
}

export async function generateTask(
  taskType: WorkbenchElementType,
  prompt: string,
  difficulty: number,
  language: string,
): Promise<string> {
  const response = await fetch(
    api.generateTask +
      `?exampleForAI=${JSON.stringify(taskType.exampleForAI)}&taskName=${
        taskType.name
      }&language=${language}&difficulty=${difficulty}&prompt=${prompt}`,
    { method: "GET" },
  );

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast.workbench_ai_error",
    });
    return "";
  }

  const aiResponse = await response.json();
  return aiResponse.content;
}

export function getElementTypeFromTask(typeId: number): WorkbenchElementType {
  const taskType = elementTypes.filter((type) => type.id === typeId).at(0);
  if (!taskType) throw new Error("Error: Task type not found");
  return taskType;
}

export function handleClose() {
  const { hasSpecialRole } = useCourse.getState();
  const { mode, workbenchType, setContent, setOpen, getElementsOfCurrentPage } =
    useWorkbench.getState();
  const { initModal } = useConfirmationModal.getState();
  if (
    mode >= 2 ||
    getElementsOfCurrentPage().length === 0 ||
    (hasSpecialRole &&
      workbenchType === WorkbenchType.LEARNING &&
      mode === WorkbenchMode.FILLOUT)
  ) {
    setContent({ title: "", pages: [] });
    setOpen(false);
  } else
    initModal({
      title: "Are you sure you want to close the workbench?",
      description:
        "You will lose all unsaved changes. This action cannot be undone.",
      actionName: "Continue",
      onConfirm: () => {
        setContent({ title: "", pages: [] });
        setOpen(false);
      },
    });
}

export function getPositionOfElement(id: string): number {
  const { getElementsOfCurrentPage } = useWorkbench.getState();
  return getElementsOfCurrentPage().findIndex((e) => e.id === id);
}

export function handleDragEnd(event) {
  const { getElementsOfCurrentPage, appendElement, addElementAt } =
    useWorkbench.getState();
  const { active, over } = event;
  try {
    // Find the target elements
    const targetElement = getElementsOfCurrentPage().find(
      (e) => e.id === over.id,
    );

    // Check if the target is the main content area
    if (over && over.id && over.id === "main") {
      const elementType = elementTypes.find((e) => e.id === active.id);

      if (elementType) {
        // Create a new one and append it to the end
        appendElement({
          id: cuid(),
          type: elementType.id,
          metadata: elementType.defaultMetadata,
        });
      }
    } else if (targetElement) {
      const targetIndex = getElementsOfCurrentPage().indexOf(targetElement);
      const newElementType = elementTypes.find((e) => e.id === active.id);
      if (newElementType) {
        // Create a new one and insert it at the target index
        addElementAt(
          {
            id: cuid(),
            type: newElementType.id,
            metadata: newElementType.defaultMetadata,
          },
          targetIndex,
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}
