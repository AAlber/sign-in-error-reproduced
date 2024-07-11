import cuid from "cuid";
import { updateCourseStorageCategoryWithUploadResult } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { getFileName } from "@/src/client-functions/client-cloudflare/utils";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useCourse from "@/src/components/course/zustand";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";

export const FileUploader = ({
  onUpload,
}: {
  onUpload: (url: string, name: string) => void;
}) => {
  const { id } = useContentBlockModal();
  const { course } = useCourse();
  return (
    <FileDropField
      autoProceed={true}
      sizeUpdater={updateCourseStorageCategoryWithUploadResult}
      onUploadCompleted={(url: string) => {
        const fileName = getFileName(url);
        onUpload(url, fileName || "file");
      }}
      uploadPathData={{
        type: "workbench",
        blockId: id,
        layerId: course?.layer_id,
        elementId: cuid(),
      }}
    />
  );
};
