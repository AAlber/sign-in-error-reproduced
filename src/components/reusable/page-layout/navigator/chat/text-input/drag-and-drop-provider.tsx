import React, { createContext, useContext, useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import type { DragAndDropHandlerType } from "@/src/components/reusable/simple-file-upload/useFileDragAndDropHandlers";
import type { StreamChatGenerics } from "../types";

const DragAndDropContext = createContext<
  (DragAndDropHandlerType & { canUploadFiles: boolean }) | null
>(null);

export default function DragAndDropProvider({
  children,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDrop,
}: React.PropsWithChildren<DragAndDropHandlerType>) {
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const [canUploadFiles, setCanUploadFiles] = useState(
    !channel?.data?.isFileAttachmentsDisabled ||
      !!channel.data?.own_capabilities?.includes("upload-file"),
  );

  useEffect(() => {
    const { unsubscribe } = channel.on("channel.updated", async (e) => {
      let _canUploadFiles = !e.channel?.isFileAttachmentsDisabled;

      if (typeof _canUploadFiles === "undefined") {
        const { channel: channel_ } = await channel.query({});
        _canUploadFiles = !!channel_.own_capabilities?.includes("upload-file");
      }

      setCanUploadFiles(_canUploadFiles);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DragAndDropContext.Provider
      value={{
        dragActive: canUploadFiles && dragActive,
        canUploadFiles,
        onDragEnter,
        onDragLeave,
        onDrop,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
}

export const useChatDragAndDropContext = () => {
  const ctx = useContext(DragAndDropContext);
  if (!ctx) throw new Error("Must be used inside DragAndDropProvider");
  return ctx;
};
