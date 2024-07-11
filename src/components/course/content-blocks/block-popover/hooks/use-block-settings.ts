import { useCallback } from "react";
import type { ContentBlock } from "@/src/types/course.types";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import useCourse from "../../../zustand";
import useContentBlockFinishedModal from "../../block-finished-modal/zustand";
import useBlockPopover from "../zustand";

export const useBlockSettings = ({
  blockId,
  block,
}: {
  blockId: string;
  block: ContentBlock;
}) => {
  const { user } = useUser();
  const { isTestingMode } = useCourse();
  const { open } = useContentBlockFinishedModal();
  const { openBlock, setOpenBlock } = useBlockPopover();

  const isPopoverOpen = openBlock === blockId && !open;
  const isSharedHandin =
    block?.type === "HandIn" && block?.specs?.isSharedSubmission;

  const openPopover = useCallback(() => {
    setOpenBlock(openBlock === blockId ? null : blockId);
  }, [blockId, openBlock, setOpenBlock]);

  const isFeedbackEnabled =
    user.institution?.institutionSettings.addon_lms_feedbacks &&
    user.institution?.institutionSettings.feedback_content_blocks;

  const canGiveRating =
    isFeedbackEnabled &&
    !isTestingMode &&
    (block.userStatus === "REVIEWED" || block.userStatus === "FINISHED");

  const logClick = useCallback((context, id) => {
    log.click(context, id);
  }, []);

  return {
    isPopoverOpen,
    openPopover,
    closePopover: openPopover,
    isSharedHandin,
    blockConfig: block,
    isFeedbackEnabled,
    canGiveRating,
    logClick,
  };
};
