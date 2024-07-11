import dayjs from "dayjs";
import useCourse from "@/src/components/course/zustand";
import type { ContentBlock } from "@/src/types/course.types";
import type {
  LearningJourneyAlignment,
  LearningJourneyState,
} from "@/src/types/learning-journey.types";
import { getBlocksInsideSectionBlock, isBlockOfType } from "./utils";

export class LearningJourneyHelper {
  private static instance: LearningJourneyHelper;

  /**
   * Gets the singleton instance of the LearningJourneyHelper.
   * @returns {LearningJourneyHelper} The singleton instance of the LearningJourneyHelper.
   */

  static get(): LearningJourneyHelper {
    if (!LearningJourneyHelper.instance) {
      LearningJourneyHelper.instance = new LearningJourneyHelper();
    }
    return LearningJourneyHelper.instance;
  }

  /**
   * Gets the content blocks for a learning journey.
   * @param {boolean} isStudent - Whether the user is a student.
   * @param {boolean} removeSections - Whether to remove the sections or not. Default is false.
   * @returns {ContentBlock[]} An array of content blocks.
   * @throws Will throw an error if the content blocks are not found.
   *
   * @example
   * ```typescript
   * const contentBlocks = LearningJourneyHelper.get().getContentBlocks(true);
   * ```
   */
  getContentBlocks(isStudent: boolean, removeSections = false): ContentBlock[] {
    const { contentBlocks } = useCourse.getState();
    if (isStudent) {
      return contentBlocks.filter((block) => {
        const isPublishedOrComingSoon =
          block.status === "PUBLISHED" || block.status === "COMING_SOON";
        const isNotSection = removeSections ? block.type !== "Section" : true;
        return isPublishedOrComingSoon && isNotSection;
      });
    }

    if (removeSections) {
      return contentBlocks.filter((block) => block.type !== "Section");
    }

    return contentBlocks;
  }

  /**
   * Get the content block positions.
   * @param {number} length - The length of the content blocks.
   * @returns {LearningJourneyAlignment[]} An array of content block positions.
   * @throws Will throw an error if the content block positions are not found.
   *
   * @example
   * ```typescript
   * const positions = LearningJourneyHelper.get().getBlockPositions(5);
   * ```
   */
  getBlockPositions(length: number): LearningJourneyAlignment[] {
    const cycle = [
      "center",
      "left",
      "far-left",
      "left",
      "center",
      "right",
      "far-right",
      "right",
    ];

    const positions: LearningJourneyAlignment[] = [];
    let currentCycleIndex = 0;

    for (let i = 0; i < length; i++) {
      positions.push(cycle[currentCycleIndex] as LearningJourneyAlignment);
      currentCycleIndex = (currentCycleIndex + 1) % cycle.length; // Move para o próximo índice do ciclo
    }

    return positions;
  }

  /**
   * Gets the first unlocked block.
   * @param {ContentBlock[]} blocks - An array of content blocks.
   * @returns {string | null | undefined} The ID of the first unlocked block.
   * @throws Will throw an error if the first unlocked block is not found.
   *
   * @example
   * ```typescript
   * const firstUnlockedBlock = LearningJourneyHelper.get().getFirstUnlockedBlock(contentBlocks);
   * ```
   */
  getFirstUnlockedBlock(blocks: ContentBlock[]): string | null | undefined {
    if (blocks.length === 0) return null;

    const unlockedBlocks = blocks.filter(
      (block) =>
        this.getBlockState(block) === "unlocked" && block.type !== "Section",
    );
    const unlockedBlock = unlockedBlocks[0];

    return unlockedBlock?.id;
  }

  /**
   * Gets the block status state.
   * @param {ContentBlock} block - The content block.
   * @returns {LearningJourneyState} The status state of the block.
   * @throws Will throw an error if the block status state is not found.
   *
   * @example
   * ```typescript
   * const blockState = LearningJourneyHelper.get().getBlockState(block);
   * ```
   */
  getBlockState(block: ContentBlock): LearningJourneyState {
    switch (block.userStatus) {
      case "LOCKED":
        return "locked";
      case "FINISHED":
      case "REVIEWED":
        return "completed";
      case "NOT_STARTED":
        return "unlocked";
      case "IN_PROGRESS":
        return "unlocked";
      default:
        return "upcoming-or-ended";
    }
  }

  /**
   * Gets the block IDs inside sections.
   * @param {ContentBlock[]} contentBlocks - An array of content blocks.
   * @returns {string[]} An array of block IDs inside sections.
   * @throws Will throw an error if the block IDs inside sections are not found.
   *
   * @example
   * ```typescript
   * const blockIdsInsideSections = LearningJourneyHelper.get().getBlockIdsInsideSections(contentBlocks);
   * ```
   */
  getBlockIdsInsideSections(contentBlocks: ContentBlock[]): string[] {
    const sectionBlockIds = contentBlocks
      .filter((block) => isBlockOfType(block, "Section"))
      .map((block) => block.id);

    let blocksInsideSection: string[] = [];
    sectionBlockIds.forEach((sectionBlockId) => {
      blocksInsideSection = [
        ...blocksInsideSection,
        ...getBlocksInsideSectionBlock(sectionBlockId).map((block) => block.id),
      ];
    });
    return blocksInsideSection;
  }

  /**
   * Gets if the block is in the date range.
   * @param {ContentBlock} block - The content block.
   * @returns {boolean} Whether the block is in the date range.
   * @throws Will throw an error if the block is not in the date range.
   *
   * @example
   * ```typescript
   * const isInDateRange = LearningJourneyHelper.get().isBlockInDateRange(block);
   * ```
   */
  isBlockInDateRange(block: ContentBlock): boolean {
    if (!block.startDate || !block.dueDate) return false;
    const startDate = dayjs(block.startDate);
    const endDate = dayjs(block.dueDate);
    const today = dayjs();
    return !(today.isAfter(startDate) && today.isBefore(endDate));
  }

  /**
   * Gets the last block before a section and he cant be inside a section.
   * @param {ContentBlock[]} contentBlocks - An array of content blocks.
   * @param {ContentBlock} sectionBlock - The section block.
   * @returns {ContentBlock | null} The last block before the section.
   * @throws Will throw an error if the last block before the section is not found.
   *
   * @example
   * ```typescript
   * const lastBlockBeforeSection = LearningJourneyHelper.get().getLastBlockBeforeSection(contentBlocks, sectionBlock);
   * ```
   * */
  getLastBlockBeforeSection(
    contentBlocks: ContentBlock[],
    sectionBlock: ContentBlock,
  ): ContentBlock | null {
    const sectionBlockPosition = sectionBlock.position;
    if (!sectionBlockPosition) return null;

    const blocksInsideSection = getBlocksInsideSectionBlock(sectionBlock.id);

    const lastBlockBeforeSection = contentBlocks
      .filter((block) => !blocksInsideSection.includes(block))
      .sort((a, b) => a.position! - b.position!)
      .find((block) => block.position! < sectionBlockPosition);

    return lastBlockBeforeSection || null;
  }

  /**
   * Calculate the percentage of completed blocks inside a section.
   * @param {ContentBlock} sectionBlock - The section block.
   * @param {boolean} showPercentage  - Whether to show the percentage or not. Default is true.
   * @returns {number | {
   * totalBlocks: number,
   * completedBlocks: number,
   * }} The percentage of completed blocks inside the section.
   * @throws Will throw an error if the percentage of completed blocks inside the section is not found.
   * */

  calculateCompletedBlocksInSection(
    sectionBlock: ContentBlock,
    showPercentage: boolean,
  ): number | { totalBlocks: number; completedBlocks: number } {
    const blocksInsideSection = getBlocksInsideSectionBlock(sectionBlock.id);
    const completedBlocks = blocksInsideSection.filter(
      (block) =>
        block.userStatus === "FINISHED" || block.userStatus === "REVIEWED",
    );

    if (!showPercentage) {
      return {
        totalBlocks: blocksInsideSection.length,
        completedBlocks: completedBlocks.length,
      };
    }

    return (completedBlocks.length / blocksInsideSection.length) * 100;
  }

  /**
   * Gets all the blocks who are not inside a section.
   * @param {ContentBlock[]} contentBlocks - An array of content blocks.
   * @returns {ContentBlock[]} An array of blocks who are not inside a section.
   * @throws Will throw an error if the blocks who are not inside a section are not found.
   *
   * @example
   * ```typescript
   * const blocksNotInsideSection = LearningJourneyHelper.get().getBlocksNotInsideSection(contentBlocks);
   * ```
   * */
  getBlocksNotInsideSection(contentBlocks: ContentBlock[]): ContentBlock[] {
    const blocksInsideSection = this.getBlockIdsInsideSections(contentBlocks);
    return contentBlocks.filter(
      (block) =>
        !blocksInsideSection.includes(block.id) && block.type !== "Section",
    );
  }

  /**
   * Gets new content blocks.
   * @param {ContentBlock[]} contentBlocks - An array of content blocks.
   *
   * @example
   * ```typescript
   * const newContentBlocks = LearningJourneyHelper.get().getNewContentBlocks(contentBlocks);
   * ```
   * */
  getNewContentBlocks(contentBlocks: ContentBlock[]): ContentBlock[] {
    // return the blocks who are created in the last 7 days
    return contentBlocks.filter(
      (block) =>
        dayjs().diff(dayjs(block.createdAt), "day") <= 7 &&
        block.type !== "Section",
    );
  }
}

const learningJourneyHelper = new LearningJourneyHelper();
export default learningJourneyHelper;
