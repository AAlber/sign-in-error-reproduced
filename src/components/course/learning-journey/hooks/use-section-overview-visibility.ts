import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import { useSectionOverview } from "../learning-journey-section/section-overview/zustand";

const useSectionOverviewVisibility = (contentBlocks, isVisible) => {
  const { sectionsWhoAreInView, hideSectionOverview } = useSectionOverview();

  const isFirstBlockSection = contentBlocks[0]?.type === "Section";
  const showSectionOverview =
    sectionsWhoAreInView[0] && (!isFirstBlockSection || isVisible);

  const completePercentage = sectionsWhoAreInView[0]
    ? learningJourneyHelper.calculateCompletedBlocksInSection(
        sectionsWhoAreInView[0],
        true,
      )
    : 0;

  return {
    showSectionOverview,
    hideSectionOverview,
    sectionsWhoAreInView,
    completePercentage,
  };
};

export default useSectionOverviewVisibility;
