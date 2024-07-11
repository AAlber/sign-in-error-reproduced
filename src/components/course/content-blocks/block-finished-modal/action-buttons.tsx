import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import useCourse from "../../zustand";
import { manuallyOpenContentBlockPopover } from "../block-popover/zustand";
import CreateContentBlockFeedback from "../feedback/create-feedback";
import useContentBlockFinishedModal from "./zustand";

const CreateFeedback = dynamic(() => import("../../feedback/create-feedback"), {
  ssr: false,
});

export const ActionButtons = () => {
  const { contentBlocks, isTestingMode } = useCourse.getState();
  const { blockId, setOpen } = useContentBlockFinishedModal();
  const { t } = useTranslation("page");
  const { user } = useUser();

  const finishedBlocks = contentBlocks.filter(
    (block) =>
      block.userStatus === "FINISHED" || block.userStatus === "REVIEWED",
  );

  const percentage = Math.round(
    (finishedBlocks.length / contentBlocks.length) * 100,
  );

  const isCourseFeedbackEnabled =
    user.institution?.institutionSettings.addon_lms_feedbacks &&
    user.institution?.institutionSettings.feedback_course;

  const nextBlock = () => {
    const currentBlockIndex = contentBlocks.findIndex(
      (block) => block.id === blockId,
    );

    let nextContentBlock: ContentBlock | undefined;

    for (let i = currentBlockIndex + 1; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];

      if (!block) continue;

      if (
        block.userStatus === "NOT_STARTED" ||
        block.userStatus === "IN_PROGRESS"
      ) {
        nextContentBlock = block;
        break;
      }
    }

    if (nextContentBlock) return nextContentBlock.id;
  };

  const isFeedbackEnabled =
    user.institution?.institutionSettings.addon_lms_feedbacks &&
    user.institution?.institutionSettings.feedback_content_blocks;

  return (
    <div className="mt-8 flex w-full flex-col gap-2">
      {isFeedbackEnabled && !isTestingMode && (
        <CreateContentBlockFeedback blockId={blockId!} />
      )}
      <Button onClick={() => setOpen(false)} className="w-full">
        {t("general.close")}
      </Button>

      {percentage < 100 && nextBlock() && (
        <Button
          variant={"cta"}
          className="w-full"
          onClick={() => {
            setOpen(false);
            const nextBlockId = nextBlock();
            if (!nextBlockId) return;
            setTimeout(() => manuallyOpenContentBlockPopover(nextBlockId), 500);
          }}
        >
          {t("next_task")}
        </Button>
      )}
      {isCourseFeedbackEnabled && percentage >= 100 && (
        <div className="w-full">
          <CreateFeedback />
        </div>
      )}
    </div>
  );
};
