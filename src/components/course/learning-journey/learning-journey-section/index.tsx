import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import { getBlocksInsideSectionBlock } from "@/src/client-functions/client-contentblock/utils";
import type { ContentBlock } from "@/src/types/course.types";
import type { LearningJourneyAlignment } from "@/src/types/learning-journey.types";
import { LearningJourneyItem } from "../learning-journey-item/learning-item";
import { LearningSectionItem } from "./learning-section-item";

export const LearningSectionComponent = ({
  block,
  positions,
  loading,
  loadingUserStatus,
}: {
  block: ContentBlock;
  positions: LearningJourneyAlignment[];
  loading: boolean;
  loadingUserStatus: boolean;
}) => {
  const insideSectionBlocks = getBlocksInsideSectionBlock(block.id);
  const isSectionDisabled = learningJourneyHelper.isBlockInDateRange(block);

  return (
    <LearningSectionItem
      key={block.id}
      block={block}
      loading={loading || loadingUserStatus}
    >
      {insideSectionBlocks.map((sectionBlock, index) => {
        const align = positions[index];
        const state = learningJourneyHelper.getBlockState(sectionBlock);
        const type = contentBlockHandler.get.registeredContentBlockByType(
          sectionBlock.type,
        );
        const icon = type.style.icon;

        return (
          <LearningJourneyItem
            align={align!}
            state={state}
            block={sectionBlock}
            loading={loading}
            userStatusLoading={loadingUserStatus}
            disabled={isSectionDisabled}
            key={sectionBlock.id}
          >
            {icon}
          </LearningJourneyItem>
        );
      })}
    </LearningSectionItem>
  );
};
