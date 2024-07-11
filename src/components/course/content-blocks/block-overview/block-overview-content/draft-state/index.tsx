import { Pen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import Box from "@/src/components/reusable/box";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import useContentBlockOverview from "../../zustand";
import { EditSurvey } from "./edit-survey";
import { FilesEditor } from "./files-editor";

export default function PreviewDraftState({ block }: { block: ContentBlock }) {
  const { t } = useTranslation("page");
  const [opening, setOpening] = useState(false);
  const { setOpen } = useContentBlockOverview();
  return (
    <Box>
      <div className="relative flex items-center py-3">
        {" "}
        <div className="flex w-2/3 flex-col text-start">
          <h2 className="font-medium text-contrast">
            {t("course_main_content_block_preview_draft_state")}
          </h2>
          <p className="text-muted-contrast">
            {t("course_main_content_block_preview_draft_state_description")}
          </p>
        </div>
        <div className="flex w-1/3 items-center justify-end gap-2">
          {(block.type === "StaticWorkbenchFile" ||
            block.type === "Assessment" ||
            block.type === "EditorFile") && (
            <Button
              onClick={async () => {
                setOpening(true);
                await contentBlockHandler.zustand.open(block.id);
                setOpen(false);
              }}
            >
              {t(
                opening
                  ? "general.loading"
                  : "course_main_content_block_preview_draft_state_edit",
              )}
            </Button>
          )}
          {(block.type === "File" || block.type === "ProtectedFile") && (
            <FilesEditor block={block}>
              <Button>
                <Pen className="size-4" />
              </Button>
            </FilesEditor>
          )}
          {block.type === "Survey" && <EditSurvey block={block} />}
          <Button
            variant={"cta"}
            onClick={async () => {
              confirmAction(
                () => {
                  contentBlockHandler.update.block({
                    id: block.id,
                    status: "PUBLISHED",
                  });
                  setOpen(false);
                },
                {
                  title: t(
                    "course_main_content_block_status_publish_confirmation_title",
                  ),
                  description: t(
                    "course_main_content_block_status_publish_confirmation_description",
                  ),
                  actionName: t("general.confirm"),
                },
              );
            }}
          >
            {t("course_main_content_block_preview_draft_state_publish")}
          </Button>
        </div>
      </div>
    </Box>
  );
}
