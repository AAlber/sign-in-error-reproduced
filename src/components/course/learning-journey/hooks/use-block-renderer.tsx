import React, { useEffect } from "react";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import type { ContentBlock } from "@/src/types/course.types";
import type { LearningJourneyAlignment } from "@/src/types/learning-journey.types";
import { LearningComponent } from "../learning-journey-item";
import { LearningSectionComponent } from "../learning-journey-section";
import { useSectionOverview } from "../learning-journey-section/section-overview/zustand";

const BlockRenderer = React.memo(
  ({
    block,
    contentBlocks,
    index,
    positions,
    loading,
    loadingUserStatus,
    blocksIdsInsideSections,
  }: {
    block: ContentBlock;
    contentBlocks: ContentBlock[];
    index: number;
    positions: LearningJourneyAlignment[];
    loading: boolean;
    loadingUserStatus: boolean;
    blocksIdsInsideSections: string[];
  }) => {
    const {
      blocksBeforeSections,
      setBlocksBeforeSections,
      setLastBlockBeforeSection,
      lastBlockBeforeSection: lastBlockBeforeSectionZustand,
    } = useSectionOverview();

    const sectionBlock = block.type === "Section" ? block : null;

    useEffect(() => {
      const blocksBeforeSection =
        sectionBlock &&
        learningJourneyHelper.getBlocksNotInsideSection(contentBlocks);
      if (blocksBeforeSection) {
        setLastBlockBeforeSection(
          blocksBeforeSection[blocksBeforeSection.length - 1]!,
        );
      }
    }, [sectionBlock, contentBlocks, setLastBlockBeforeSection]);

    useEffect(() => {
      const blocksBeforeSection =
        sectionBlock &&
        learningJourneyHelper.getBlocksNotInsideSection(contentBlocks);
      if (blocksBeforeSection) {
        setBlocksBeforeSections(blocksBeforeSection);
      }
    }, [sectionBlock, contentBlocks, setBlocksBeforeSections]);

    const isIncludedInSections = blocksIdsInsideSections.includes(block.id);
    if (isIncludedInSections) return null;

    if (block.type === "Section") {
      return (
        <LearningSectionComponent
          key={block.id}
          block={block}
          positions={positions}
          loading={loading}
          loadingUserStatus={loadingUserStatus}
        />
      );
    } else {
      const align = positions[index];
      const state = learningJourneyHelper.getBlockState(block);
      const isBlockBeforeSection = blocksBeforeSections.includes(block);
      const isLastBlockBeforeSection = lastBlockBeforeSectionZustand
        ? lastBlockBeforeSectionZustand.id === block.id
        : false;
      return (
        <LearningComponent
          key={block.id}
          block={block}
          align={align!}
          state={state}
          loading={loading}
          loadingUserStatus={loadingUserStatus}
          isBlockBeforeSection={isBlockBeforeSection}
          isLastBlockBeforeSection={isLastBlockBeforeSection}
        />
      );
    }
  },
);

// Set the displayName property
BlockRenderer.displayName = "BlockRenderer";

export { BlockRenderer };
