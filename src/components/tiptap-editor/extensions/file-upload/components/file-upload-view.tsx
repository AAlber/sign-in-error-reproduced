import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";
import { FileUploader } from "./file-uploader";

export const FileUploadView = ({
  getPos,
  editor,
}: {
  getPos: () => number;
  editor: Editor;
}) => {
  const onUpload = useCallback(
    (url: string, name: string) => {
      if (url) {
        editor
          .chain()
          .setFileBlock({ src: url, name: decodeURIComponent(name) })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor],
  );

  return (
    <NodeViewWrapper>
      <div className="m-0 p-0" data-drag-handle>
        <FileUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  );
};
