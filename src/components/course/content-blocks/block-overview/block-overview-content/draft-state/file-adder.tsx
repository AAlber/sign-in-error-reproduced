import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import {
  maxFileSizes,
  supportedFileTypesForFileViewer,
} from "@/src/utils/utils";
import useContentBlockOverview from "../../zustand";

export function FileAdder({
  block,
  setTab,
}: {
  block: ContentBlock;
  setTab: (data: "files" | "add-files") => void;
}) {
  const { setBlock } = useContentBlockOverview();
  return (
    <FileDropField
      maxFileAmount={100 - block.specs.files.length}
      uploadPathData={{
        type: "block",
        blockId: block.id,
        layerId: block.layerId,
      }}
      maxFileSize={maxFileSizes.files}
      allowedFileTypes={
        block.specs.isProtected ? supportedFileTypesForFileViewer : undefined
      }
      onUploadCompleted={async (urls: string[]) => {
        await contentBlockHandler.update.block<"File">({
          id: block.id,
          specs: {
            files: [...block.specs.files, ...urls],
            isProtected: block.specs.isProtected,
          },
        });
        setBlock({
          ...block,
          specs: {
            ...block.specs,
            files: [...block.specs.files, ...urls],
          },
        });
        if (block.status === "PUBLISHED") {
          toast.success("file_uploaded", {
            description: "file_uploaded_after_publish_toast",
            duration: 15000,
          });
        }
        setTab("files");
      }}
    />
  );
}
