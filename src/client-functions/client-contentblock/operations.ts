import type { ContentBlockFeedback, ContentBlockRating } from "@prisma/client";
import { track } from "@vercel/analytics";
import useContentBlockFinishedModal from "@/src/components/course/content-blocks/block-finished-modal/zustand";
import useContentBlockOverview from "@/src/components/course/content-blocks/block-overview/zustand";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useCourse from "@/src/components/course/zustand";
import { silentlyRefreshDynamicTabs } from "@/src/components/dashboard/functions";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ReorderContentBlockPositionArgs } from "@/src/pages/api/content-block/reorder";
import { initializeContentBlockRegistry } from "@/src/types/content-block/init";
import type { ContentBlockRegistry } from "@/src/types/content-block/registry";
import type {
  ContentBlockCategory,
  CreateContentBlock,
  CreateContentBlockFeedback,
  RegisteredContentBlock,
  UpdateContentBlock,
  UpdateContentBlockRequirements,
  UpsertUserGrading,
} from "@/src/types/content-block/types/cb-types";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import type {
  ContentBlockUserDataMapping,
  ContentBlockUserStatus,
  ContentBlockUserStatusOfUser,
  GetContentBlockUserOfUserStatusRequest,
  UpdateContentBlockMultipleUserStatusRequest,
  UpdateContentBlockUserStatusRequest,
  UserDataForBlock,
} from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { log } from "@/src/utils/logger/logger";
import { deleteContentBlockFiles } from "../client-cloudflare";
import { courseDrive } from "../client-drive/drive-builder";
import { deepCopy } from "../client-utils";
import { ErrorHandler } from "./error-handler";
/**
 * Represents a class that handles various operations related to content blocks in a course.
 */
export class ContentBlockOperations {
  /** The registry that holds information about registered content block types. */
  private registry: ContentBlockRegistry;
  /** A singleton instance of the `ContentBlockOperations` class. */
  private static instance: ContentBlockOperations;
  /**
   * Creates an instance of the `ContentBlockOperations` class.
   * @param {ContentBlockRegistry} registry - The content block registry.
   * @private
   */
  private constructor(registry: ContentBlockRegistry) {
    this.registry = registry;
  }

  static getInstance(): ContentBlockOperations {
    if (!ContentBlockOperations.instance) {
      const registry = initializeContentBlockRegistry();
      ContentBlockOperations.instance = new ContentBlockOperations(registry);
    }
    return ContentBlockOperations.instance;
  }

  // API endpoints
  private readonly apiPath = "/api/content-block";
  private readonly api = {
    createEndpoint: `${this.apiPath}/create`,
    deleteEndpoint: `${this.apiPath}/delete`,
    reorderEndpoint: `${this.apiPath}/reorder`,
    updateEndpoint: `${this.apiPath}/update`,
    getEndpoint: `${this.apiPath}/get`,
    createFeedbackEndpoint: `${this.apiPath}/create-feedback`,
    updateRequirementEndpoint: `${this.apiPath}/update-requirement`,
    getUserStatusEndpoint: `${this.apiPath}/get-user-status`,
    upsertUserGradingEndpoint: `${this.apiPath}/upsert-user-grading`,
    getUserStatusForSpecificUserEndpoint: `${this.apiPath}/get-user-status-for-specific-user`,
    updateUserStatusEndpoint: `${this.apiPath}/update-user-status`,
    updateMultipleUserStatusEndpoint: `${this.apiPath}/update-multiple-user-status`,
  };

  private async handleApiResponse<T>(
    response: Response,
    onError?: () => void,
  ): Promise<T | undefined> {
    if (!response.ok) {
      onError?.();
      ErrorHandler.handleAPIError(response, "content_block_api_error");
      return;
    }

    return (await response.json()) as Promise<T>;
  }

  /****************** CONTENT BLOCK CRUD  *************/

  async createBlock<T extends keyof ContentBlockSpecsMapping>(
    createData: CreateContentBlock<T>,
  ) {
    ErrorHandler.setContext(createData, "Creating content block ...");
    try {
      const blockType = this.registry.get(createData.type);
      if (blockType.onBeforeCreate) {
        log.info("Running content block type specific pre creation step...");
        const success = await blockType.onBeforeCreate();
        if (typeof success === "boolean" && !success) {
          return null;
        }
      }
    } catch (error) {
      ErrorHandler.handleException(error, "content_block_create_error");
      return null;
    }

    const { data, dueDate, startDate } = useContentBlockModal.getState();

    log.info("Creating content block in backend...");
    const response = await fetch(this.api.createEndpoint, {
      method: "POST",
      body: JSON.stringify({
        ...createData,
        specs: {
          ...data,
        },
        dueDate,
        startDate,
      }),
    });

    const result = await this.handleApiResponse<ContentBlock<T>>(response);
    if (result) {
      log.info("Content block created successfully.");
      track("Content Block created", {
        value: createData.type,
      });

      const { updateCourse, course } = useCourse.getState();
      const isDependentOfASection = result.requirements.some(
        (req) => req.type === "Section",
      );
      if (isDependentOfASection) {
        log.info("Removing the section requirement...");
        this.removeRequirement({
          blockId: result.id,
          requirementId: result.requirements[0]!.id,
        });
      }

      updateCourse({
        totalContentBlockCount: (course.totalContentBlockCount ?? 0) + 1,
      });
    }
    return result;
  }
  catch(error) {
    ErrorHandler.handleException(error, "content_block_create_error");
    return null;
  }

  async updateBlock<T extends keyof ContentBlockSpecsMapping>(
    data: UpdateContentBlock<T>,
  ) {
    ErrorHandler.setContext(data, "Updating content block...");
    const { contentBlocks, updateContentBlock } = useCourse.getState();

    log.info("Cloning content block...");
    const clonedBlock = {
      ...contentBlocks.find((block) => block.id === data.id),
    };

    log.info("Updating UI optimistically...");
    const { id, type: _type, ...rest } = data;
    updateContentBlock(id, rest);

    log.info("Updating backend...");
    const response = await fetch(this.api.updateEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return this.handleApiResponse<UpdateContentBlock<T>>(response, () => {
      // revert update on error
      log.warn("Updating content block failed. Reverting UI changes.");
      log.response(response);
      updateContentBlock(data.id, clonedBlock);
    });
  }

  async getBlock(
    layerId: string,
    blockId: string,
  ): Promise<ContentBlock | null> {
    ErrorHandler.setContext({ layerId, blockId }, "Getting content block ...");
    const url = new URL(
      `${this.api.getEndpoint}/${layerId}`,
      window.location.origin,
    );

    url.searchParams.append("blockId", blockId);

    const response = await fetch(url);
    if (!response.ok) {
      toast.responseError({ response });
      log.response(response);
      log.info("Getting content block failed.");
      return null;
    }

    return (await response.json()) as Promise<ContentBlock>;
  }

  async deleteBlock(blockId: string) {
    ErrorHandler.setContext({ blockId }, "Deleting content block ...");
    const { contentBlocks, setContentBlocks, removeContentBlock, course } =
      useCourse.getState();

    log.info("Cloning content blocks...");
    const clonedBlocks = [...contentBlocks];

    log.info("Updating UI optimistically...");
    const block = contentBlocks.find((b) => b.id === blockId);

    // remove block from state, reset requirements of blocks that depends on block to be deleted
    removeContentBlock(blockId);

    log.info("Updating backend...");
    const [response] = await Promise.all([
      fetch(this.api.deleteEndpoint, {
        method: "DELETE",
        body: JSON.stringify({ blockId }),
      }),
      deleteContentBlockFiles({ blockId, block }).then(() => {
        courseDrive.api.getStorageCategories({
          type: "course-drive",
          layerId: course.layer_id,
        });
      }),
    ]);

    const blockIndexToDelete = contentBlocks.findIndex(
      (block) => block.id === blockId,
    );

    /**
     * - we also need to update those blocks that depends on the block to be deleted from the backend
     * - only applies to dependsOnPrevious blocks
     */

    const blockIdxRequiringDeletedBlock = clonedBlocks.findIndex((b) =>
      b.requirements.some((req) => req.id === blockId),
    );

    if (
      blockIdxRequiringDeletedBlock > 1 && // if index is lte 1, just remove the contentBlock
      blockIdxRequiringDeletedBlock - 1 === blockIndexToDelete // only applies to depends on previousBlock
    ) {
      const updatedRequirementOfAffectedBlock =
        contentBlocks[blockIdxRequiringDeletedBlock - 2];

      if (updatedRequirementOfAffectedBlock && response.ok) {
        await this.addRequirement({
          blockId: contentBlocks[blockIdxRequiringDeletedBlock]!.id,
          requirementId: contentBlocks[blockIdxRequiringDeletedBlock - 2]!.id,
        });
      }
    }

    if (contentBlocks[blockIndexToDelete]) {
      const { updateCourse, course } = useCourse.getState();
      updateCourse({
        totalContentBlockCount: Math.max(
          (course.totalContentBlockCount ?? 0) - 1,
          0,
        ),
      });
    }

    log.info("Finished Deleting ...");
    return this.handleApiResponse<{ success: true }>(response, () => {
      // revert on error
      log.response(response);
      log.warn("Deleting content block failed. Reverting UI changes.");
      setContentBlocks(clonedBlocks);
    });
  }

  getContentBlockOrThrow(blockId: string): ContentBlock {
    const { contentBlocks } = useCourse.getState();
    const block = contentBlocks.find((b) => b.id === blockId);
    if (!block) {
      ErrorHandler.handleException(
        new Error("Block not found in zustand: getContentBlockOrThrow"),
        "content-block_not_found",
      );
      return {} as any;
    }
    return block;
  }

  async getAllBlocksOfLayer(layerId: string): Promise<ContentBlock[]> {
    const response = await fetch(`${this.api.getEndpoint}/${layerId}`);
    if (!response.ok) {
      toast.responseError({ response });
      log.error({ response }, "getAllBlocksOfLayer API failed");
      return [];
    }

    return (await response.json()) as Promise<ContentBlock[]>;
  }

  async order(args: ReorderContentBlockPositionArgs) {
    ErrorHandler.setContext(args, "Reordering content blocks ...");
    useCourse.setState({ blocksAreLoading: true });
    const { contentBlocks, setContentBlocks, updateContentBlock } =
      useCourse.getState();

    log.info("Cloning content blocks...");
    const clone = deepCopy(contentBlocks);

    log.info("Updating UI optimistically...");
    args.contentBlocks.forEach((block) => {
      updateContentBlock(block.id, { position: block.position });
    });

    log.info("Updating backend...");
    const response = await fetch(this.api.reorderEndpoint, {
      method: "POST",
      body: JSON.stringify(args),
    });

    useCourse.setState({ blocksAreLoading: false });
    return this.handleApiResponse<ContentBlock[]>(response, () => {
      // revert on error
      log.response(response);
      log.warn("Reordering content blocks failed. Reverting UI changes.");
      setContentBlocks(clone);
    });
  }

  /****************** UPDATE CONTENT BLOCK REQUIREMENTS  *************/

  async addRequirement({
    blockId,
    requirementId,
  }: UpdateContentBlockRequirements): Promise<void> {
    ErrorHandler.setContext(
      {
        blockId,
        requirementId,
      },
      "Adding requirement to content block ...",
    );
    const { contentBlocks, updateContentBlockRequirements } =
      useCourse.getState();

    log.info("Removing existing requirements...");
    // just remove all existing requirements
    const blockToUpdate = contentBlocks.find((b) => b.id === blockId);
    blockToUpdate?.requirements.forEach((req) => {
      updateContentBlockRequirements(blockId, req.id, "remove");
    });

    log.info("Adding new requirement ...");
    updateContentBlockRequirements(blockId, requirementId, "add");

    log.info("Updating backend...");
    useCourse.setState({ blocksAreLoading: true });
    const response = await fetch(this.api.updateRequirementEndpoint, {
      method: "POST",
      body: JSON.stringify({ blockId, requirementId }),
    });
    if (!response.ok) {
      // revert on error
      log.response(response);
      log.warn(
        "Adding requirement to content block failed. Reverting UI changes.",
      );
      updateContentBlockRequirements(blockId, requirementId, "remove");
    }
    useCourse.setState({ blocksAreLoading: false });
    return this.handleApiResponse(response);
  }

  async removeRequirement(args: UpdateContentBlockRequirements): Promise<void> {
    ErrorHandler.setContext(
      args,
      "Removing requirement from content block ...",
    );
    const { updateContentBlockRequirements } = useCourse.getState();
    updateContentBlockRequirements(args.blockId, args.requirementId, "remove");

    log.info("Updating backend...");
    useCourse.setState({ blocksAreLoading: true });
    const response = await fetch(this.api.updateRequirementEndpoint, {
      method: "DELETE",
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      // revert on error
      log.response(response);
      log.warn(
        "Removing requirement from content block failed. Reverting UI changes.",
      );
      updateContentBlockRequirements(args.blockId, args.requirementId, "add");
    }

    useCourse.setState({ blocksAreLoading: false });
    return this.handleApiResponse(response);
  }

  /****************** CONTENT BLOCK FEEDBACK *************/

  async createFeedback(args: CreateContentBlockFeedback) {
    const response = await fetch(this.api.createFeedbackEndpoint, {
      method: "POST",
      body: JSON.stringify(args),
    });

    return this.handleApiResponse<ContentBlockFeedback>(response);
  }

  /****************** USER GRADING *************/

  async createGrading(args: Omit<UpsertUserGrading, "id">) {
    const response = await fetch(this.api.upsertUserGradingEndpoint, {
      method: "POST",
      body: JSON.stringify(args),
    });

    return this.handleApiResponse(response);
  }

  async updateGrading(args: UpsertUserGrading & { id: string }) {
    const response = await fetch(this.api.upsertUserGradingEndpoint, {
      method: "POST",
      body: JSON.stringify(args),
    });

    return this.handleApiResponse<ContentBlockRating>(response);
  }

  /****************** USER STATUS *************/

  async getBlockUserStatus<
    T extends keyof ContentBlockUserDataMapping | undefined = undefined,
  >(
    blockId: string,
    includeUserData = false,
  ): Promise<ContentBlockUserStatus<T>[]> {
    ErrorHandler.setContext(
      { blockId, includeUserData },
      "Getting content block user status ...",
    );
    const url = new URL(this.api.getUserStatusEndpoint, window.location.origin);
    url.searchParams.append("blockId", blockId);
    url.searchParams.append("includeUserData", String(includeUserData));

    log.info("Fetching user data for content block ...");
    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        log.response(response);
        log.warn("Could not get user data for content block");
        throw new Error(
          "Could not get user data for content block, response status:" +
            response.status +
            " " +
            response.statusText,
        );
      }

      const data = await response.json();
      return includeUserData
        ? (data as ContentBlockUserStatus<T>[])
        : data.map((item: any) => ({ ...item, userData: undefined }));
    } catch (error) {
      ErrorHandler.handleException(error, "content_block_user_error");
      return [];
    }
  }

  async getBlockUserStatusForSpecificUser<
    T extends keyof ContentBlockUserDataMapping | undefined = undefined,
  >(
    request: GetContentBlockUserOfUserStatusRequest,
  ): Promise<ContentBlockUserStatusOfUser<T>> {
    ErrorHandler.setContext(
      { blockId: request.blockId, userId: request.userId },
      "Getting content block user status for specific user ...",
    );
    const url = new URL(
      this.api.getUserStatusForSpecificUserEndpoint,
      window.location.origin,
    );
    url.searchParams.append("blockId", request.blockId);
    url.searchParams.append("userId", request.userId || "");

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        log.response(response);
        log.warn("Could not get user data for content block");
        throw new Error("Content block not found in zustand");
      }

      const data = await response.json();
      return data as ContentBlockUserStatusOfUser<T>;
    } catch (error) {
      ErrorHandler.handleException(error, "content_block_user_error");
      return { status: "NOT_STARTED" };
    }
  }

  async updateBlockUserStatus<T extends keyof ContentBlockUserDataMapping>(
    request: UpdateContentBlockUserStatusRequest<T>,
  ): Promise<boolean> {
    ErrorHandler.setContext(
      { blockId: request.blockId, data: request.data },
      "Updating content block user status ...",
    );
    const { contentBlocks, updateContentBlock } = useCourse.getState();

    log.info("Cloning content block ...");
    const clonedBlock = {
      ...contentBlocks.find((block) => block.id === request.blockId),
    };

    log.info("Updating UI optimistically ...");
    updateContentBlock(request.blockId, { userStatus: request.data.status });

    const response = await fetch(this.api.updateUserStatusEndpoint, {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      log.response(response);
      log.warn(
        "Could not update user data for content block. Reverting UI Changes.",
      );
      ErrorHandler.handleAPIError(
        response,
        "Cannot update user data for content block",
      );
      updateContentBlock(request.blockId, {
        userStatus: clonedBlock.userStatus,
      });

      return false;
    }

    return true;
  }

  async updateBlockMultipleUserStatus<
    T extends keyof ContentBlockUserDataMapping,
  >(request: UpdateContentBlockMultipleUserStatusRequest<T>): Promise<boolean> {
    ErrorHandler.setContext(
      {
        blockId: request.blockId,
        data: request.data,
        userIds: request.userIds,
      },
      "Updating content block for users' status ...",
    );
    const { contentBlocks, updateContentBlock } = useCourse.getState();

    log.info("Cloning content block ...");
    const clonedBlock = {
      ...contentBlocks.find((block) => block.id === request.blockId),
    };

    log.info("Updating UI optimistically ...");
    updateContentBlock(request.blockId, { userStatus: request.data.status });

    const response = await fetch(this.api.updateMultipleUserStatusEndpoint, {
      method: "POST",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      log.response(response);
      log.warn(
        "Could not update user data for content block. Reverting UI Changes.",
      );
      ErrorHandler.handleAPIError(
        response,
        "Cannot update user data for content block",
      );
      updateContentBlock(request.blockId, {
        userStatus: clonedBlock.userStatus,
      });

      return false;
    }

    return true;
  }

  /****************** ZUSTAND AND STATIC OPERATIONS *************/

  getContentBlockTypes(): RegisteredContentBlock[] {
    return this.registry.getRegisteredBlocks();
  }

  async finishBlock<T extends keyof ContentBlockUserDataMapping>(
    blockId: string,
    userData?: UserDataForBlock<T>,
  ) {
    ErrorHandler.setContext(
      { blockId, userData },
      "Finishing content block ...",
    );

    log.info("Updating user status for content block ...");
    await this.updateBlockUserStatus<T>({
      blockId: blockId,
      data: {
        status: "FINISHED",
        userData: userData as any,
      },
    });
    silentlyRefreshDynamicTabs();
    useContentBlockFinishedModal.setState({ open: true, blockId });
    log.info("Content block finished successfully.");
    track("User finished content block");
  }

  getContentBlockType(
    blockType: keyof ContentBlockSpecsMapping,
  ): RegisteredContentBlock {
    const registeredBlock = this.registry.get(blockType);
    if (!registeredBlock) {
      throw new Error(`Block type with name ${blockType} not found.`);
    }
    return registeredBlock;
  }

  getCategories(): ContentBlockCategory[] {
    return this.registry.getCategories();
  }

  async open(blockId: string) {
    ErrorHandler.setContext({ blockId }, "Opening content block ...");
    try {
      const userStatus = await this.getBlockUserStatusForSpecificUser({
        blockId,
      });
      const block = this.getContentBlockOrThrow(blockId);
      if (!block) {
        log.error({ blockId }, "Block not found in zustand");
        throw new Error("Content block not found in zustand");
      }
      const blockType = this.registry.get(block.type);
      blockType.open(block, userStatus);
    } catch (error) {
      log.error(error, "Error opening content block");
      ErrorHandler.handleException(error, "content_block_open_error");
      return null;
    }
  }

  openOverview(blockId: string) {
    ErrorHandler.setContext({ blockId }, "Opening content block overview ...");
    try {
      const { contentBlocks } = useCourse.getState();
      const { openOverview } = useContentBlockOverview.getState();
      const block = contentBlocks.find((b) => b.id === blockId);
      if (!block) {
        log.error({ blockId }, "Block not found in zustand");
        throw new Error("Content block not found in zustand");
      }
      const blockType = this.getContentBlockType(block.type);
      if (blockType.options.hasUserOverview) openOverview(block);
    } catch (error) {
      log.error(error, "Error opening content block overview");
      ErrorHandler.handleException(error, "content_block_open_error");
      return null;
    }
  }

  getContentBlocksFromZustand(): ContentBlock[] {
    ErrorHandler.setContext({}, "Getting content blocks from zustand ...");
    const { contentBlocks } = useCourse.getState();
    return contentBlocks;
  }
}
