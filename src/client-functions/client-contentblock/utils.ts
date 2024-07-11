import useCourse from "@/src/components/course/zustand";
import api from "@/src/pages/api/api";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";

/**
 * Accepts a generic because the response can be
 * different if a moderator or a student is making the request
 */
/** @deprecated feedbacks are fetched getInitialCourseData */
export async function getContentBlockFeedback<T>(args: {
  layerId: string;
  blockId: string;
}): Promise<T> {
  const { blockId, layerId } = args;
  const data = await fetch(
    `${api.getContentBlockFeedback}?layerId=${layerId}&blockId=${blockId}`,
  );

  const result = await data.json();
  return result;
}

/**
 * Updates content block optimistically ~ do not wait for async transaction
 * to complete before updating contentBlock state
 */
export async function optimisticUpdateContentBlock(
  blockId: string,
  data: Partial<ContentBlock>,
  asyncTransaction: <T>(id: string) => Promise<T | void>,
) {
  const { contentBlocks, updateContentBlock } = useCourse.getState();
  const clone = { ...contentBlocks.find((block) => block.id === blockId) };

  updateContentBlock(blockId, data);
  return await asyncTransaction(blockId).catch((e) => {
    console.log(e);
    // revert to initial on error
    updateContentBlock(blockId, clone);
  });
}

// check for circular loop in contentBlocks requirement
export function checkForRequirementLoop(
  blocks: ContentBlock[],
  blockId?: string,
): boolean {
  let prevId = "";
  if (!blocks) return false;
  return blocks.some((req) => {
    if (req.id === blockId || req.id === prevId) return true;
    prevId = req.id;
    return checkForRequirementLoop(req.requirements);
  });
}

export function getBlocksInsideSectionBlock(sectionBlockId: string) {
  const { contentBlocks } = useCourse.getState();
  const sectionBlock = contentBlocks.find(
    (block) => block.id === sectionBlockId,
  );
  if (!sectionBlock) return [];
  const sectionBlockPosition = sectionBlock.position;
  const nextSectionBlock = contentBlocks.find(
    (block) =>
      block.position! > sectionBlockPosition! && block.type === "Section",
  );
  const blocksInsideSection = contentBlocks.filter(
    (block) =>
      block.position! > sectionBlockPosition! &&
      block.position! < (nextSectionBlock?.position ?? Infinity),
  );
  return blocksInsideSection;
}

/** typeguard helper so that typescript can infer the type of the contentBlock */
export function isBlockOfType<T extends keyof ContentBlockSpecsMapping>(
  contentBlock: ContentBlock,
  specs: T,
): contentBlock is ContentBlock<T> {
  return contentBlock.type === specs;
}

export function updateRequirementsAndSortContentBlocks(
  contentBlocks: ContentBlock[],
) {
  const previousState = useCourse.getState().contentBlocks;
  const blockToRequirementTypeMapping =
    _contentBlockToRequirementTypeMapping(previousState);

  const sortedCbs: ContentBlock[] = [];

  contentBlocks.forEach((block, idx) => {
    const blockRequirementType = blockToRequirementTypeMapping[block.id];
    const blockBefore = sortedCbs[idx - 1]; // the block before current index of this new mapping

    if (isBlockOfType(block, "Section")) {
      // a section or divider cannot have requirements
      sortedCbs.push({
        ...block,
        position: idx,
        requirements: [],
      });
      return;
    }

    const reqIndex = sortedCbs.findIndex(
      (i) => i.id === block.requirements[0]?.id,
    );

    if (blockRequirementType === "dependsOnSpecific") {
      sortedCbs.push({
        ...block,
        position: idx,
        // requirementIndex cannot be greater than current index
        requirements: reqIndex > -1 ? block.requirements : [],
      });

      return;
    }

    if (blockRequirementType !== "dependsOnPrevious" || !blockBefore) {
      sortedCbs.push({ ...block, position: idx, requirements: [] });
      return;
    }

    if (isBlockOfType(blockBefore, "Section")) {
      let requirement: ContentBlock[] = [];

      // find the previous block that is not a divider
      for (let i = sortedCbs.length - 1; i >= 0; i--) {
        const blockAtPos = sortedCbs[i];
        if (blockAtPos) {
          if (isBlockOfType(blockAtPos, "Section")) continue;
          requirement = [blockAtPos];
          break;
        }
      }

      sortedCbs.push({
        ...block,
        position: idx,
        requirements: requirement,
      });
      return;
    }

    sortedCbs.push({
      ...block,
      position: idx,
      requirements: [blockBefore],
    });
  });

  return sortedCbs;
}

/** Returns a mapping of contentBlockId to its requirement type */
function _contentBlockToRequirementTypeMapping(contentBlock: ContentBlock[]) {
  return contentBlock.reduce<ContentBlockToRequirementTypeMapping>(
    (prev, curr, idx, self) => {
      const hasRequirements = !!curr.requirements.length;
      const requirementBlock = curr.requirements[0]?.id;
      const previousBlock = self[idx - 1]?.id;

      return {
        ...prev,
        [curr.id]: !hasRequirements
          ? "nonDependent"
          : requirementBlock === previousBlock
          ? "dependsOnPrevious"
          : "dependsOnSpecific",
      };
    },
    {},
  );
}

type ContentBlockToRequirementTypeMapping = Record<
  string,
  "dependsOnPrevious" | "dependsOnSpecific" | "nonDependent"
>;

export const hasPublishedContentBlocks = (
  course: CourseWithDurationAndProgress,
) => {
  return (
    course.publishedContentBlockCount && course.publishedContentBlockCount > 0
  );
};

export const hasTotalContentBlocks = (
  course: CourseWithDurationAndProgress,
) => {
  return course.totalContentBlockCount && course.totalContentBlockCount > 0;
};

export const hasContentBlocks = (contentBlocks: ContentBlock[]) => {
  return contentBlocks.length > 0;
};
