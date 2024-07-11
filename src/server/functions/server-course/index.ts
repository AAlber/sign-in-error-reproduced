import type {
  ContentBlockStatus,
  ContentBlockUserStatus,
  UserStatus,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import cuid from "cuid";
import type {
  ContentBlock,
  CourseDataWithLayerData,
} from "@/src/types/course.types";
import type { CopyLayerContentToAnotherLayerArgs } from "@/src/types/server/course.types";
import type { NewMoveFilesData } from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { isJsonObject, isStringArray } from "@/src/utils/utils";
import { prisma } from "../../db/client";
import { getSimpleLayer } from "../server-administration";
import { storageHandler } from "../server-cloudflare/storage-handler";
import type { PathSegmentations } from "../server-cloudflare/utils";
import {
  decodeAndGetKey,
  getValueAfterSegment,
  replaceValueAfterSegment,
} from "../server-cloudflare/utils";

export async function loadCourse(layerId: string) {
  const courseData = await getCourseData(layerId);
  return courseData;
}

export async function getCourseData(
  layerId: string,
): Promise<CourseDataWithLayerData | null> {
  return await prisma.course.findFirst({
    where: {
      layer_id: layerId,
    },
    include: {
      layer: true,
    },
  });
}

export async function getContentBlocks(layerId: string) {
  return (await prisma.contentBlock.findMany({
    where: { layerId },
    include: { requirements: true },
  })) as ContentBlock[];
}

export async function getContentBlocksWithFeedback(layerId: string) {
  Sentry.addBreadcrumb({ message: "Fetching content blocks" });
  const contentBlocks = await getContentBlocks(layerId);

  Sentry.addBreadcrumb({ message: "Fetching content block feedbacks" });
  const getFeedbacksPromises = contentBlocks.map(async ({ id }) => {
    const feedback = await prisma.contentBlockFeedback.aggregate({
      where: { blockId: id },
      _avg: { rating: true },
      _count: { blockId: true },
    });

    return {
      blockId: id,
      average: feedback._avg.rating ?? 0,
      count: feedback._count.blockId,
    };
  });

  const contentBlockFeedbacks = await Promise.all(getFeedbacksPromises);

  Sentry.addBreadcrumb({ message: "Merging content blocks and feedbacks" });
  return contentBlocks.map((block) => {
    const blockFeedback = contentBlockFeedbacks.find(
      ({ blockId }) => block.id === blockId,
    );

    return {
      ...block,
      feedback: {
        rating: blockFeedback?.average ?? 0,
        count: blockFeedback?.count ?? 0,
      },
    };
  }) as ContentBlock[];
}

export async function copyLayerContentToAnotherLayer({
  layerIdToImportTo,
  layerIdToImportFrom,
  overwriteExistingContent,
  selectedContentBlockIds,
}: CopyLayerContentToAnotherLayerArgs) {
  if (overwriteExistingContent) await deleteCourseContent(layerIdToImportTo);

  const isCopyingToAnotherLayer = layerIdToImportFrom !== layerIdToImportTo;

  const contentBlocks = await prisma.contentBlock.findMany({
    where: {
      id: { in: selectedContentBlockIds },
      layerId: layerIdToImportFrom,
    },
    include: { requirements: { select: { id: true } } },
  });

  // get how many blocks in layerToImport so we can later correctly add block position
  const count = await prisma.contentBlock.count({
    where: { layerId: layerIdToImportTo },
  });

  /**
   * maps the existing blockId to a newly created blockId,
   * we'll need this later when copying the block requirements
   */
  const blockIdMapping = new Map<string, string>();

  // always create new contentBlocks
  const blockObjects = contentBlocks.map(
    (
      { id, layerId: _layerId, requirements: _requirements, specs, ...block },
      index,
    ) => {
      const blockId = cuid();
      blockIdMapping.set(id, blockId);
      return {
        ...block,
        id: blockId,
        status: "DRAFT" as ContentBlockStatus,
        layerId: layerIdToImportTo,
        position: index + count,
        specs: specs !== null ? specs : Prisma.JsonNull, // keep specs as is for now
      };
    },
  );

  // Then, handle any asynchronous operations
  const resolvedBlocks = await Promise.all(
    blockObjects.map(async (block) => {
      const finalSpecs = block.specs;
      if (
        finalSpecs &&
        isJsonObject(finalSpecs) &&
        isStringArray(finalSpecs.files) &&
        finalSpecs.files.length > 0
      ) {
        await moveFileContentBlockFiles({
          fileUrls: finalSpecs.files,
          blockId: block.id,
          layerId: layerIdToImportTo,
        });

        finalSpecs.files = finalSpecs.files.map((url) =>
          replaceSegments({
            url,
            newSegments: [
              {
                segment: "layer",
                newValue: layerIdToImportTo,
              },
              {
                segment: "block",
                newValue: block.id,
              },
            ],
          }),
        );
      }
      return {
        ...block,
        specs: finalSpecs !== null ? finalSpecs : Prisma.JsonNull,
      };
    }),
  );

  // Now, use createMany with the resolved blocks
  await prisma.contentBlock.createMany({
    data: resolvedBlocks,
    skipDuplicates: true,
  });

  // remove requirements not included in the slectedContentBlockIds
  const filteredContentBlocks = contentBlocks.map((block) => {
    return {
      ...block,
      requirements: block.requirements.filter((i) =>
        selectedContentBlockIds.includes(i.id),
      ),
    };
  });

  const requirementsPromise = filteredContentBlocks.map((block, idx) => {
    return prisma.contentBlock.update({
      where: { id: blockIdMapping.get(block.id), layerId: layerIdToImportTo },
      data: {
        requirements: {
          /**
           * if copying to another layer then only add requirements included in selectedContentBlockIds
           * else add all of the blocks requirements
           */
          connect: isCopyingToAnotherLayer
            ? block.requirements.map(({ id }) => ({
                id: blockIdMapping.get(id),
              }))
            : contentBlocks[idx]?.requirements.map((id) => id),
        },
      },
    });
  });

  await Promise.allSettled(requirementsPromise);
}

export async function deleteCourseContent(layerId: string) {
  await prisma.contentBlock.deleteMany({ where: { layerId } });
}

export async function getCourseRoles(userId: string, layerId: string) {
  const rolesCourse = await prisma.role.findMany({
    where: {
      userId,
      layerId,
    },
  });
  if (rolesCourse.length > 0) {
    return rolesCourse;
  } else {
    const layer = await getSimpleLayer(layerId);
    const rolesParent = await prisma.role.findMany({
      where: {
        userId,
        layerId,
        institutionId: layer?.institution_id,
      },
    });
    return rolesParent;
  }
}

export async function getMembersOfCourse(
  layerId: string,
): Promise<SimpleUser[]> {
  const members = await prisma.role.findMany({
    where: {
      layerId,
      role: "member",
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const uniqueMembers = members
    .map((member) => member.user)
    .filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id),
    );

  return uniqueMembers.map((member) => member);
}

/**
 * if blockId is string, then return the UserStatus of that ContentBlock
 * else if blockId is an array, then return all available statuses (if any)
 * within the blockId array
 */
export function getUserStatusOfContentBlocks(
  blockId: string,
  userId: string,
): Promise<ContentBlockUserStatus>;

export function getUserStatusOfContentBlocks(
  blockId: string[],
  userId: string,
): Promise<ContentBlockUserStatus[]>;

export async function getUserStatusOfContentBlocks(
  blockId: string | string[],
  userId: string,
): Promise<ContentBlockUserStatus | ContentBlockUserStatus[]> {
  if (Array.isArray(blockId)) {
    return await prisma.contentBlockUserStatus.findMany({
      where: { userId, blockId: { in: blockId } },
    });
  }

  return await prisma.contentBlockUserStatus.findFirstOrThrow({
    where: { userId, blockId },
  });
}

/**
 * Evaluate status of a content block based on the
 * status of each of its requirement
 * @param blocks - the contentBlocks array to evaluate,
 * ids are assumed to belong to the same layerId
 */
export async function evaluateContentBlocksStatusFromItsRequirements(
  userId: string,
  blocks: ContentBlock[],
): Promise<
  {
    id: string;
    userStatus: UserStatus | "LOCKED";
  }[]
> {
  /**
   * get status of eachContentBlock, some blocks may not yet have a status
   * therefore returned length can be less than `blocks` length.
   */
  const contentBlockUserStatus = await getUserStatusOfContentBlocks(
    blocks.map((i) => i.id),
    userId,
  );

  const findContentBlockStatus = (blockId: string) =>
    contentBlockUserStatus.find((u) => u.blockId === blockId)?.status ??
    "NOT_STARTED";

  return blocks.map((block) => ({
    id: block.id,
    userStatus:
      block.requirements.length &&
      block.requirements.some((req) => {
        const reqStatus = findContentBlockStatus(req.id);
        return reqStatus !== "FINISHED" && reqStatus !== "REVIEWED";
      })
        ? ("LOCKED" as const)
        : findContentBlockStatus(block.id),
  }));
}

export const moveFileContentBlockFiles = async ({
  fileUrls,
  layerId,
  blockId,
}: {
  fileUrls: string[];
  layerId: string;
  blockId: string;
}) => {
  if (!fileUrls[0]) throw new Error("No file url");
  const institutionId = getValueAfterSegment({
    url: fileUrls[0],
    segment: "institutions",
  });
  const newBaseKey =
    "institutions/" + institutionId + "/layer/" + layerId + "/block/" + blockId;

  const data: NewMoveFilesData[] = fileUrls.map((url) => {
    return {
      sourceKey: decodeAndGetKey(url),
      destinationKey:
        newBaseKey + decodeAndGetKey(url.replace(getUrlUpToBlockId(url), "")),
      deleteSourceKey: false,
    };
  });
  log.info("Moving Content Block files", { data }).cli();
  const res = await storageHandler.copy.files(data);
  return res;
};

export function getUrlUpToBlockId(url: string) {
  const regex = /(handIn|workbench|block)\/[^\/]*/;
  const match = url.match(regex);
  return match
    ? url.substring(0, url.indexOf(match[0]) + match[0].length)
    : url;
}

export function replaceSegments({
  url,
  newSegments,
}: {
  url: string;
  newSegments: {
    segment: PathSegmentations;
    newValue: string;
  }[];
}) {
  let finalUrl = url;
  newSegments.forEach(({ segment, newValue }) => {
    finalUrl = replaceValueAfterSegment({ url: finalUrl, segment, newValue });
  });
  return finalUrl;
}
