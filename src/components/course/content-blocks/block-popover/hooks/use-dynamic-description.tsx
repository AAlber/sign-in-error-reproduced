import { useTranslation } from "react-i18next";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";

export const useDynamicDescription = (
  block: ContentBlock,
  registredBlock: RegisteredContentBlock,
) => {
  const { t } = useTranslation("page");
  const { contentBlocks } = useCourse();

  if (block.userStatus === "LOCKED") {
    const previousBlock = contentBlocks.find(
      (contentBlock) => contentBlock.position === block.position! - 1,
    );

    return t("content_blocks.blocked_description", {
      blockName: previousBlock?.name,
    });
  } else {
    return block.description || t(registredBlock.hint);
  }
};
