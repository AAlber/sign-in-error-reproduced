import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCourseStorageCategoryWithUploadResult } from "@/src/client-functions/client-cloudflare/uppy-logic";
import {
  getDecodedFileNameFromUrl,
  getFileName,
} from "@/src/client-functions/client-cloudflare/utils";
import classNames, {
  downloadFileFromUrl,
} from "@/src/client-functions/client-utils";
import useCourse from "@/src/components/course/zustand";
import FileDropOver from "@/src/components/reusable/file-uploaders/file-drop-over";
import { maxFileSizes } from "@/src/utils/utils";
import useWorkbench from "../../zustand";

export function ElementBody(elementId) {
  const { getElementMetadata, updateElementMetadata, mode, blockId } =
    useWorkbench();
  const { course } = useCourse();
  const [fileName, setFileName] = useState<string | undefined>();
  const hasFileAttached = getElementMetadata(elementId).url;
  const { t } = useTranslation("page");
  return (
    <>
      {!hasFileAttached ? (
        <div
          onClick={() => {
            if (mode > 0) return;
          }}
          className="w-full"
        >
          <FileDropOver
            uploadPathData={{
              type: "workbench",
              elementId,
              layerId: course.layer_id,
              blockId,
            }}
            maxFileSize={maxFileSizes.files}
            sizeUpdater={updateCourseStorageCategoryWithUploadResult}
            onUploadCompleted={(url: string) => {
              const fileName = getDecodedFileNameFromUrl(url || "");
              if (!fileName) throw new Error("Failed to parse url");
              updateElementMetadata(elementId, {
                url: url,
                name: getFileName(fileName),
              });
              setFileName(fileName);
            }}
          >
            <div
              onClick={() => {
                if (mode > 0) return;
              }}
              className="flex w-full cursor-pointer items-center rounded-lg bg-background px-4 py-2 text-muted-contrast hover:bg-secondary"
            >
              <Paperclip
                className={classNames(
                  "pointer-events-none mr-2 w-5 text-muted-contrast",
                )}
              />
              <span
                className={classNames(
                  "pointer-events-none",
                  !fileName && "text-muted-contrast",
                )}
              >
                {hasFileAttached && fileName
                  ? fileName
                  : t("workbench.sidebar_element_file_input_placeholder1")}
              </span>
            </div>
          </FileDropOver>
        </div>
      ) : (
        <div
          onClick={async () =>
            await downloadFileFromUrl(
              getElementMetadata(elementId).name,
              getElementMetadata(elementId).url,
            )
          }
          className="relative flex w-full cursor-pointer items-center rounded-lg bg-background px-4 py-2 text-muted-contrast hover:bg-secondary"
        >
          <Paperclip
            className={classNames("pointer-events-none mr-2 w-5 text-primary")}
          />{" "}
          <a className="text-sm font-medium text-contrast">
            {getElementMetadata(elementId).name}
          </a>
        </div>
      )}
    </>
  );
}
