import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import HighlightTag from "@/src/components/reusable/highlight-tag";
import type { ContentBlock } from "@/src/types/course.types";
import type { LearningJourneyState } from "@/src/types/learning-journey.types";
import ContentBlockPopover from "../../content-blocks/block-popover";
import useCourse from "../../zustand";
import { LearningItemInfo } from "./learning-item-info";

export const LearningItemContentWrapper = ({
  block,
  disabled,
  state,
  loading,
  children,
}: {
  block: ContentBlock;
  disabled: boolean;
  state: LearningJourneyState;
  loading: boolean;
  children: React.ReactNode;
}) => {
  const { contentBlocks } = useCourse();
  const showHighlight =
    block &&
    learningJourneyHelper.getFirstUnlockedBlock(contentBlocks) === block.id;

  return (
    <>
      <ContentBlockPopover
        block={block}
        disabled={
          disabled || state === "locked" || state === "upcoming-or-ended"
        }
      >
        <HighlightTag
          text={"cb.learning_journey.next_block"}
          offset={{
            x: -50,
            y: -150,
          }}
          disabled={disabled || !showHighlight}
        >
          {children}
        </HighlightTag>
      </ContentBlockPopover>
      <LearningItemInfo loading={loading} block={block} state={state} />
    </>
  );
};
