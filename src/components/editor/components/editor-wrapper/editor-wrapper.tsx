import type { DragEndEvent } from "@dnd-kit/core";
import { DragOverlay, useDndMonitor, useDroppable } from "@dnd-kit/core";
import type { Editor } from "@tiptap/core";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import cuid from "cuid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { initializeFileUploader } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { uploadDroppedFiles } from "@/src/client-functions/client-editor";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import { generateHtmlNodeImage } from "@/src/client-functions/client-workbench";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useCourse from "@/src/components/course/zustand";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import { TiptapEditor } from "@/src/components/tiptap-editor";
import { Extensions } from "../../../tiptap-editor/extensions";
import { useEditor } from "../../zustand";
import { ElementLibrary } from "../element-library";
import { Element } from "../element-library/element";
import elementRegistryHandler from "../element-library/handler";
import type { RegisteredElement } from "../element-library/registry";
import { PageManager } from "../navigation/page-manager";
import PageNavigator from "../navigation/page-navigator/page-navigator";

interface Props {
  aiToken: string;
}

export const EditorWrapper = ({ aiToken }: Props) => {
  const {
    canCreate,
    currentPageId,
    getCurrentPageContent,
    updateCurrentPageContent,
    updatePageThumbnail,
  } = useEditor();
  const { t } = useTranslation("page");
  const { id } = useContentBlockModal();
  const { course } = useCourse();
  const { setUppy } = useFileDrop();

  const { setNodeRef, node } = useDroppable({
    id: "editor-wrapper",
  });

  const [dragEndEvent, setDragEndEvent] = useState<DragEndEvent | null>(null);
  const [element, setElement] = useState<RegisteredElement | undefined>(
    undefined,
  );
  const [editorContent, setEditorContent] = useState<string>("");

  useDebounce(
    async () => {
      if (!node.current) return;
      const base64Image = await generateHtmlNodeImage(node.current, "base64");

      if (!base64Image) return;
      updatePageThumbnail(currentPageId, base64Image as string);
    },
    [editorContent],
    1500,
  );

  const elementTypes = elementRegistryHandler.getRegisteredElements();

  const { AI, FileHandler, ...RestExtensions } = Extensions(t);

  const onPasteFiles = async (editor: Editor, files: File[]) => {
    const uppy = initializeFileUploader({
      uploadPathData: {
        type: "workbench",
        blockId: id,
        layerId: course?.layer_id,
        elementId: cuid(),
      },
      maxFileAmount: 5,
    });

    setUppy(uppy);

    const content = await uploadDroppedFiles(uppy, files);

    if (!content) return;

    editor.commands.insertContent(content);
  };

  const onDropFiles = async (editor: Editor, files: File[], pos: number) => {
    const uppy = initializeFileUploader({
      uploadPathData: {
        type: "workbench",
        blockId: id,
        layerId: course?.layer_id,
        elementId: cuid(),
      },
      maxFileAmount: 5,
    });

    setUppy(uppy);

    const content = await uploadDroppedFiles(uppy, files);

    if (!content) return;

    editor.commands.insertContentAt(pos, content);
  };

  const editor = useTiptapEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none p-10 h-full overflow-y-scroll",
      },
    },
    editable: canCreate,
    extensions: [
      FileHandler.configure({
        onDrop: onDropFiles,
        onPaste: onPasteFiles,
      }),
      AI.configure({
        appId: "0k3zzr95",
        token: aiToken,
        autocompletion: true,
      }),
      ...Object.values(RestExtensions),
    ],
    content: getCurrentPageContent(),
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
      updateCurrentPageContent(editor.getJSON());
    },
    autofocus: true,
  });

  useDndMonitor({
    onDragStart(event) {
      elementTypes.filter((item, index: number) => {
        if (item.name === event.active.id) {
          setElement(elementTypes[index]);
        }
      });
    },
    onDragEnd: (event) => {
      setElement(undefined);
      setDragEndEvent(event);

      editor?.view.dom.dispatchEvent(new DragEvent("dragend"));
    },
    onDragMove: (event) => {
      const left = (event.activatorEvent as any).clientX + event.delta.x;
      const top = (event.activatorEvent as any).clientY + event.delta.y;

      const newDragMoveEvent = new DragEvent("dragover", {
        clientX: left,
        clientY: top,
      });

      editor?.view.dom.dispatchEvent(newDragMoveEvent);
    },
  });

  useEffect(() => {
    if (!dragEndEvent || dragEndEvent.over?.id !== "editor-wrapper") return;

    const left =
      (dragEndEvent.activatorEvent as any).clientX + dragEndEvent.delta.x;
    const top =
      (dragEndEvent.activatorEvent as any).clientY + dragEndEvent.delta.y;

    const pos = editor?.view.posAtCoords({
      left,
      top,
    });

    elementTypes.filter((item, index: number) => {
      if (item.name === dragEndEvent.active.id) {
        editor &&
          pos &&
          elementTypes[index]?.onDrop?.({
            editor,
            pos: pos.pos,
          });
      }
    });
  }, [dragEndEvent]);

  useEffect(() => {
    editor?.commands.setContent(getCurrentPageContent());
  }, [currentPageId]);

  return (
    editor && (
      <div className="flex h-full overflow-hidden">
        {canCreate && <ElementLibrary editor={editor} />}
        {aiToken && (
          <div className="flex w-full flex-col">
            <div
              className="relative h-full overflow-hidden"
              id="editor-render-div"
            >
              <TiptapEditor
                ref={setNodeRef}
                editor={editor}
                menus={{
                  link: {
                    enabled: canCreate,
                  },
                  textBubble: {
                    enabled: canCreate,
                  },
                  contentDrag: {
                    enabled: canCreate,
                  },
                  imageBlock: {
                    enabled: canCreate,
                  },
                  tableRow: {
                    enabled: canCreate,
                  },
                  tableColumn: {
                    enabled: canCreate,
                  },
                  column: {
                    enabled: canCreate,
                  },
                }}
                className="bg-foreground"
              />
            </div>
            {!canCreate && <PageNavigator />}
          </div>
        )}
        {canCreate && <PageManager />}
        <DragOverlay>
          {element ? <Element element={element} /> : null}
        </DragOverlay>
      </div>
    )
  );
};
