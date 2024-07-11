import { UploadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { withPortal } from "@/src/components/portal";
import { useChatDragAndDropContext } from "./drag-and-drop-provider";

type Props = {
  onFileDrop: (files: FileList) => Promise<void> | void;
};

function DragAndDropOverlay({ onFileDrop }: Props) {
  const { dragActive, onDragEnter, onDrop } = useChatDragAndDropContext();
  const { t } = useTranslation("page");

  if (!dragActive) return null;
  return (
    <div
      className="group absolute inset-0 h-full w-full bg-background/80 p-6"
      onDragEnter={onDragEnter}
      onDragLeave={onDragEnter}
      onDragOver={onDragEnter}
      onDrop={(e) => {
        const files = onDrop(e);
        onFileDrop(files);
      }}
    >
      <div className="pointer-events-none relative flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-muted-contrast/50 text-center text-white ">
        <UploadIcon className="h-6 w-6 text-contrast" />
        <h2 className="mt-2 text-lg font-bold text-contrast antialiased">
          {t("chat.channel.drag_and_drop.overlay.title")}
        </h2>
        <p className="text-sm text-muted-contrast">
          {t("chat.channel.drag_and_drop.overlay.subtitle")}
        </p>
      </div>
    </div>
  );
}

/**
 * we use portal here because we want this overlay to receive contexts from `useMessageInputContext`, but we also want to render
 * the overlay as a child of innerChannel so that the boundary of this overlay will be constrained to edges of innerChannel
 */
export default withPortal(
  DragAndDropOverlay,
  "channelInner",
  "dndMessageInput",
);
