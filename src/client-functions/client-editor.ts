import type { Editor } from "@tiptap/react";
import { isTextSelection } from "@tiptap/react";
import type Uppy from "@uppy/core";
import type { TFunction } from "i18next";
import { toast as sonnerLib } from "sonner";
import { filterUndefined } from "@/src/utils/utils";
import { toast } from "../components/reusable/toaster/toast";
import type { PlaceholderContentFn } from "../components/tiptap-editor/types";
import api from "../pages/api/api";
import { deleteCloudflareDirectories } from "./client-cloudflare";
import { getDownloadUrlFromUploadUrl } from "./client-cloudflare/utils";

export const getEditorAIToken = async (): Promise<string> => {
  const res = await fetch(api.getEditorAItoken, { method: "POST" });
  const { token } = (await res.json()) as { token: string };
  return token;
};

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripColumn =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-column.selected");
  const gripRow =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-row.selected");

  if (gripColumn || gripRow) {
    return true;
  }

  return false;
};

export const isCustomNodeSelected = (
  editor: Editor,
  node: HTMLElement,
): boolean => {
  const customNodes = [
    "link",
    "codeBlock",
    "imageBlock",
    "imageUpload",
    "fileBlock",
    "fileUpload",
    "youtubeEmbed",
    "youtube",
    "table",
    "tableOfContentNode",
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};

export const isTextSelected = (editor: Editor) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export const getRenderContainer = (editor: Editor, nodeType: string) => {
  const {
    view,
    state: {
      selection: { from },
    },
  } = editor;

  const elements = document.querySelectorAll(".has-focus");
  const elementCount = elements.length;
  const innermostNode = elements[elementCount - 1];
  const element = innermostNode;

  if (
    (element &&
      element.getAttribute("data-type") &&
      element.getAttribute("data-type") === nodeType) ||
    (element && element.classList && element.classList.contains(nodeType))
  ) {
    return element;
  }

  const node = view.domAtPos(from).node as HTMLElement;
  let container: HTMLElement | null = node;

  if (!container.tagName) {
    container = node.parentElement;
  }

  while (
    container &&
    !(
      container.getAttribute("data-type") &&
      container.getAttribute("data-type") === nodeType
    ) &&
    !container.classList.contains(nodeType)
  ) {
    container = container.parentElement;
  }

  return container;
};

export const getDefaultPlaceholder =
  (t: TFunction<"page">) =>
  ({ node }: Parameters<PlaceholderContentFn>[0]) => {
    if (node.type.name === "heading") {
      switch (node.attrs.level) {
        case 1:
          return t("editor_placeholder_heading1");
        case 2:
          return t("editor_placeholder_heading2");
        default:
          return t("editor_placeholder_heading3");
      }
    }
    if (node.type.name === "listItem") {
      return t("editor_placeholder_list_item_text");
    }

    if (node.type.name === "quoteText") {
      return t("editor_placeholder_quote_text");
    }

    if (node.type.name === "quoteCaption") {
      return t("editor_placeholder_quote_caption");
    }

    if (node.type.name === "paragraph") {
      return t("editor_placeholder_text");
    }

    return "";
  };

export const uploadDroppedFiles = async (uppy: Uppy, files: File[]) => {
  let loadingToast;

  try {
    const filteredFiles = files.filter((file) => {
      return file.type.startsWith("image/") || file.type === "application/pdf";
    });

    if (filteredFiles.length === 0) throw new Error("");

    loadingToast = toast.loading("general.loading", { description: "" });

    uppy.addFiles(
      filteredFiles.map((file) => ({
        name: file.name,
        type: file.type,
        data: file,
      })),
    );

    const data = await uppy.upload();

    const content = data.successful.map((file) => {
      const url = getDownloadUrlFromUploadUrl(file.uploadURL);

      if (file.type === "application/pdf") {
        return {
          type: "fileBlock",
          attrs: {
            src: url,
            name: file.name,
          },
        };
      }

      return {
        type: "imageBlock",
        attrs: {
          src: url,
        },
      };
    });

    if (!content) throw new Error("");

    sonnerLib.dismiss(loadingToast);
    toast.success("general.success", {
      description: "",
      duration: 1000,
    });

    return content;
  } catch (e) {
    sonnerLib.dismiss(loadingToast);
    toast.error("Error", { description: "", duration: 1000 });
  }
};

export const deleteEditorFileNodes = async (
  data: { nodeType?: string; src?: string }[],
) => {
  if (!data) return;
  const filteredData = data.filter(
    (node) =>
      node.src &&
      (node.nodeType === "imageBlock" || node.nodeType === "fileBlock"),
  );
  if (filteredData.length === 0) return;
  const deletionData = filteredData
    .map((node) => {
      if (!node.src || !node.nodeType) return;
      return {
        url: node.src,
        isFolder: false,
      };
    })
    .filter(filterUndefined);
  await deleteCloudflareDirectories(deletionData);
};
