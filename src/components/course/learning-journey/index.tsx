import useCourse from "../zustand";
import { BlockRenderer } from "./hooks/use-block-renderer";
import { useLearningJourneyContent } from "./hooks/use-learning-journey-content";
import useSetNewContentBlocks from "./hooks/use-set-news-badge";
import { SectionOverview } from "./learning-journey-section/section-overview";
import { LearningJourneyLoadingGrid } from "./loading-grid";
import ScrollHelper from "./scroll-helper";

export const LearningJourney = () => {
  const {
    contentBlocks,
    positions,
    blocksIdsInsideSections,
    loadingUserStatus,
  } = useLearningJourneyContent();

  const course = useCourse((state) => state.course);
  const isReady = contentBlocks.length > 0 && !loadingUserStatus;

  useSetNewContentBlocks(contentBlocks, isReady);

  return (
    <div
      id="learning-journey"
      className="relative flex size-full flex-col items-center py-8"
    >
      <div className="relative flex w-full flex-col items-center gap-2">
        {course.totalContentBlockCount === contentBlocks.length &&
          !loadingUserStatus && (
            <SectionOverview contentBlocks={contentBlocks} />
          )}

        <LearningJourneyLoadingGrid
          loading={loadingUserStatus || contentBlocks.length === 0}
        />

        {isReady &&
          contentBlocks.map((block, index) => (
            <BlockRenderer
              key={block.id}
              block={block}
              index={index}
              positions={positions}
              loading={false}
              loadingUserStatus={false}
              blocksIdsInsideSections={blocksIdsInsideSections}
              contentBlocks={contentBlocks}
            />
          ))}
      </div>
      <ScrollHelper />
    </div>
  );
};
