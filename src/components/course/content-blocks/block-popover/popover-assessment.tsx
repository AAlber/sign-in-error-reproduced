import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import BlockStatus from "./block-custom-popover-components/block-status";

type AssessmentPopoverProps = {
  block: ContentBlock;
};

export default function AssessmentPopover({ block }: AssessmentPopoverProps) {
  const { t } = useTranslation("page");
  const [opening, setOpening] = useState(false);

  const emoji =
    block.userStatus === "REVIEWED"
      ? "✅"
      : block.userStatus === "FINISHED"
      ? "🎉"
      : block.userStatus === "IN_PROGRESS"
      ? "📝"
      : "📄";
  const heading =
    block.userStatus === "REVIEWED"
      ? "assessment_corrected"
      : block.userStatus === "FINISHED"
      ? "assessment_submitted"
      : block.userStatus === "IN_PROGRESS"
      ? "assessment_in_progress"
      : "assessment_not_started";
  const text =
    block.userStatus === "REVIEWED"
      ? "assessment_corrected_description"
      : block.userStatus === "FINISHED"
      ? "assessment_submitted_description"
      : block.userStatus === "IN_PROGRESS"
      ? "assessment_in_progress_description"
      : "assessment_not_started_description";

  return (
    <div>
      <BlockStatus emoji={emoji} heading={heading} text={text} />
      <div className="mt-2 flex w-full items-center justify-end gap-2">
        {block.userStatus !== "FINISHED" && (
          <Button
            variant={"cta"}
            className="w-full"
            disabled={opening}
            onClick={async () => {
              setOpening(true);
              await contentBlockHandler.zustand.open(block.id);
              setOpening(false);
            }}
          >
            {opening
              ? t("general.loading")
              : block.userStatus === "NOT_STARTED"
              ? t("general.start")
              : block.userStatus === "IN_PROGRESS"
              ? t("general.continue")
              : t("general.view")}
          </Button>
        )}
      </div>
    </div>
  );
}
