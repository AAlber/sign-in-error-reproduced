import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { maxFileSizes } from "@/src/utils/utils";
import useCourse from "../../course/zustand";
import { FileDropField } from "../file-uploaders/file-drop-field";
import type { IconSelectorProps } from ".";

export function IconUploader({
  onSelect,
}: Pick<IconSelectorProps, "onSelect">) {
  const { course } = useCourse();

  return (
    <FileDropField
      uploadPathData={{
        type: "public",
        subPath: "layer/" + course.layer_id + "/icon",
      }}
      autoProceed
      maxFileSize={maxFileSizes.icons}
      allowedFileTypes={["image/*"]}
      onUploadCompleted={async (url: string) => {
        if (course.icon.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!)) {
          deleteCloudflareDirectories([
            {
              url: course.icon,
              isFolder: false,
            },
          ]);
        }
        onSelect(url, "custom");
      }}
    />
  );
}
