import { useEditor as useTiptapEditor } from "@tiptap/react";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { generateHtmlNodeImage } from "@/src/client-functions/client-workbench";
import { Extensions, TiptapEditor } from "@/src/components/tiptap-editor";
import type { EditorPage } from "../../../types";
import { useEditor } from "../../../zustand";

interface Props {
  page: EditorPage;
  setIsThumbnailGenerated: (isThumbnailGenerated: boolean) => void;
}

export const ThumbnailGenerator = ({
  setIsThumbnailGenerated,
  page,
}: Props) => {
  const { t } = useTranslation("page");
  const { updatePageThumbnail } = useEditor();

  const editorRef = useRef<HTMLDivElement>(null);
  const target = document.getElementById("editor-render-div");

  const { AI, ...RestExtensions } = Extensions(t);

  const editor = useTiptapEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none p-10 overflow-y-scroll",
      },
    },
    editable: false,
    extensions: [...Object.values(RestExtensions)],
    content: page.content,
  });

  useEffect(() => {
    if (!page.content) {
      setIsThumbnailGenerated(true);
      return;
    }

    if (!editor || !editorRef.current) return;

    generateHtmlNodeImage(editorRef.current, "base64")
      .then((base64Image) => {
        if (!base64Image) return;
        updatePageThumbnail(page.id, base64Image as string);
      })
      .finally(() => {
        editor.destroy();
        setIsThumbnailGenerated(true);
      });
  }, [editor, editorRef]);

  return (
    editor &&
    target &&
    ReactDOM.createPortal(
      <TiptapEditor
        ref={editorRef}
        editor={editor}
        className="absolute inset-0 -z-50 size-full bg-foreground"
      />,
      target,
    )
  );
};
