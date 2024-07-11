import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCourseStorageCategoryWithUploadResult } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { getFileName } from "@/src/client-functions/client-cloudflare/utils";
import classNames from "@/src/client-functions/client-utils";
import useCourse from "@/src/components/course/zustand";
import FileDropover from "@/src/components/reusable/file-uploaders/file-drop-over";
import useWorkbench from "@/src/components/workbench-deprecated/zustand";
import { maxFileSizes } from "@/src/utils/utils";
import type { SurveyLogic } from "../../..";
import { updateLogics } from "../../functions";

export default function LogicUploadFile({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const hasFileAttached = logic.actionLink;
  const { blockId } = useWorkbench();
  const [fileName, setFileName] = useState<string | undefined>();
  const { course } = useCourse();
  const { t } = useTranslation("page");

  return (
    <div className="relative flex grow cursor-pointer select-auto resize-none justify-start overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-contrast outline-none ring-0 placeholder:text-muted hover:bg-foreground focus:outline-none focus:ring-0">
      <FileDropover
        uploadPathData={{
          type: "workbench",
          elementId,
          blockId,
          layerId: course.layer_id,
        }}
        maxFileSize={maxFileSizes.files}
        sizeUpdater={updateCourseStorageCategoryWithUploadResult}
        onUploadCompleted={(url: string) => {
          const fileName = decodeURIComponent(getFileName(url) || "");
          if (!fileName) throw new Error("Failed to parse url");
          updateLogics(elementId, logic.id, {
            actionLink: url,
            fileName,
          });
          setFileName(fileName);
        }}
      >
        <div className="flex">
          <Paperclip
            className={classNames(
              "pointer-events-none mr-2 w-5",
              fileName ? "text-primary" : "text-muted-contrast",
            )}
          />
          <span
            className={classNames(
              "pointer-events-none",
              !fileName && "text-muted-contrast",
            )}
          >
            {hasFileAttached && logic.fileName
              ? logic.fileName
              : t(
                  "workbench.sidebar_element_survey_logic_action_download_placeholder",
                )}
          </span>
        </div>
      </FileDropover>
    </div>
  );
}
