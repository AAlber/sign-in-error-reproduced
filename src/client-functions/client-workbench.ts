import cuid from "cuid";
import { toBlob, toJpeg } from "html-to-image";
import type { Options } from "html-to-image/lib/types";
import throttle from "lodash/throttle";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { useCallback, useEffect } from "react";
import type { FieldValues, Path, UseFormProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import useCourse from "../components/course/zustand";
import { toast } from "../components/reusable/toaster/toast";
import { type WorkbenchElementType } from "../components/workbench-deprecated/elements/element-type";
import elementTypes from "../components/workbench-deprecated/elements/element-types";
import type {
  Metadata,
  WorkbenchContent,
  WorkbenchPage,
} from "../components/workbench-deprecated/types";
import useWorkbench, {
  WorkbenchMode,
  WorkbenchType,
} from "../components/workbench-deprecated/zustand";
import api from "../pages/api/api";
import confirmAction from "./client-options-modal";

export const updateThumbnail = (page: WorkbenchPage) => {
  const node = document.getElementById(`document-${page.id}-workbench`);
  const target = document.getElementById(
    `document-thumbnail-${page.id}-workbench`,
  );

  if (!node || !target) return;
  const clone = node.cloneNode(true);
  target.lastChild?.remove();
  target.appendChild(clone);
};

export function appendElementToCurrentPage(elementType: WorkbenchElementType) {
  const { appendElement } = useWorkbench.getState();
  appendElement({
    id: cuid(),
    type: elementType.id,
    metadata: elementType.defaultMetadata,
  });
}

export function hasEmptyElementsInWorkbench(): boolean {
  const { content } = useWorkbench.getState();
  const { pages } = content;
  const emptyPages = pages.filter((page) => page.elements.length === 0);
  const allElements = pages.map((page) => page.elements).flat();
  const emptyElements = allElements.filter((element) => {
    return Object.values(element.metadata).every((x) => x === null || x === "");
  });

  return emptyElements.length > 0 || emptyPages.length > 0;
}

export function getWorkbenchElementTypeFromID(id: number) {
  const type = elementTypes.find((type) => type.id === id);
  return type;
}

export function clearThumbnailsFromContent(
  content: WorkbenchContent,
): WorkbenchContent {
  return {
    ...content,
    pages: content.pages.map((page: WorkbenchPage) => {
      return {
        ...page,
        thumbnail: "",
      };
    }),
  };
}

/**
 * Stringify objects then compare the values and check if a change
 * has been made. Used to avoid unnecessary rerendering of components.
 */
export function areObjectsValueEqual(...args: object[]) {
  const strings = args.map((i) => {
    const string = JSON.stringify(i);

    // Case if value is undefined
    if (string === "{}") {
      const [entry] = Object.entries(i);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [key] = entry!;
      return JSON.stringify({ [key]: "" });
    }

    return string;
  });

  const shouldOnlyContainSingleElement =
    [...new Set([...strings])].length === 1;

  return shouldOnlyContainSingleElement;
}

/**
 * Custom useForm hook of the react-hook-form library to refresh
 * form values when another user is selected in workbench
 */

type CustomFormProps<T extends FieldValues> = {
  formProps: UseFormProps<T>;
  key: Path<Metadata> | Path<Metadata>[];
  elementId: string;
  /**
   * We pass this callback to a throttling function so we can update
   * state on input change for example
   */
  onSubmitHandler?: (val: T) => void;
};

export const useCustomForm = <T extends FieldValues>(
  args: CustomFormProps<T>,
) => {
  const { formProps, key, elementId, onSubmitHandler } = args;
  const { getElementMetadata, selectedUser } = useWorkbench();
  const methods = useForm<T>(formProps);

  /**
   * Returns the final value of the string dotNotation
   * ex. string dotNotation = `foo.bar.baz`
   * returns final value of key `baz`
   */
  function drillIntoObject(str: string | undefined) {
    if (!str) return;
    const keys = str.split(".");
    let obj: any;
    keys.forEach(
      (i) => (obj = !obj ? getElementMetadata(elementId)[i] : obj[i]),
    );

    return obj;
  }

  const throttledUpdate = useCallback(
    throttle(() => {
      if (!onSubmitHandler) return;
      methods.handleSubmit(onSubmitHandler)();
    }, 500),
    [onSubmitHandler],
  );

  useEffect(() => {
    if (!onSubmitHandler) return;
    const subscription = methods.watch(throttledUpdate);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(key)) {
      const obj = key.reduce(
        (p, c) => ({ ...p, [c]: drillIntoObject(c) }),
        {},
      ) as T;
      methods.reset(obj);
    } else {
      methods.reset({ [key]: drillIntoObject(key) } as T);
    }
  }, [selectedUser]);

  return methods;
};

/**
 * from @src/components/workbench/functions
 * **/
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
      title: "toast_workbench_error1",
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
    confirmAction(
      () => {
        setContent({ title: "", pages: [] });
        setOpen(false);
      },
      {
        title: "workbench.confirm_action_close",
        description: "workbench.confirm_action_close_description",
        actionName: "workbench.confirm_action_close_action",
        dangerousAction: true,
      },
    );
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
      (e) => e.id === over?.id,
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

export async function generateHtmlNodeImage(
  element: HTMLElement | string,
  output: "blob" | "base64",
  options?: Options,
) {
  const node =
    typeof element === "string" ? document.getElementById(element) : element;
  function filter(node) {
    return node.tagName !== "i";
  }

  const opts: Options = {
    quality: 1,
    filter: filter,
    cacheBust: true,
    includeQueryParams: true,
    ...options,
  };

  if (!node) return;

  switch (output) {
    case "blob": {
      return await toBlob(node, opts);
    }
    default: {
      return await toJpeg(node, opts);
    }
  }
}

export async function readPDF(file): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (typeof window === "undefined") {
      resolve("");
      return;
    }

    reader.onload = async (event) => {
      if (!(event.target?.result instanceof ArrayBuffer)) {
        reject("No event target");
        return;
      }

      const data = new Uint8Array(event.target.result);

      const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.7.107/build/pdf.worker.min.js`;

      getDocument({ data })
        .promise.then((pdf) => {
          const total = pdf.numPages;
          let count = 0;
          let textContent = "";

          for (let i = 1; i <= total; i++) {
            pdf
              .getPage(i)
              .then((page) => {
                page
                  .getTextContent()
                  .then((textContentPage) => {
                    textContent += textContentPage.items
                      .map((item) => (item as TextItem).str + "\n")
                      .join("");

                    if (++count === total) {
                      resolve(textContent);
                    }
                  })
                  .catch(reject);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    };

    reader.onerror = () => reject(new Error("Error reading file: "));

    reader.readAsArrayBuffer(file);
  });
}
