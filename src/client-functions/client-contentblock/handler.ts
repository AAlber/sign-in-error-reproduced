import { ContentBlockOperations } from "./operations";

export class ContentBlockHandler {
  private operations = ContentBlockOperations.getInstance();

  /**
   * All create operations for content blocks.
   */
  create = {
    /**
     * Creates a new content block.
     * @param {Object} data - The data for creating the content block.
     * @param {T} data.name - The name of the content block.
     * @param {String} data.type - The TYPE of the content block.
     * @param {string} data.layerId - The ID of the content block layer.
     * @param {CourseContentBlockStatus} data.status - The status of the content block.
     * @param {ContentBlockSpecsMapping[T]} data.metadata - The metadata for the content block.
     * @returns {Promise<ContentBlock[] | undefined>} A promise that resolves with the created content block and its metadata.
     */
    block: this.operations.createBlock.bind(this.operations),
    /**
     * Creates feedback for a content block.
     * @param {CreateContentBlockFeedback} args - The feedback data to create.
     * @returns {Promise<ContentBlockFeedback | undefined>} A promise that resolves with the created content block feedback.
     */
    feedback: this.operations.createFeedback.bind(this.operations),
    /**
     * Adds a requirement to a content block.
     * @param {UpdateContentBlockRequirements} args - The requirement data to add.
     * @returns {Promise<void>} A promise that resolves when the requirement is added successfully.
     */
    requirement: this.operations.addRequirement.bind(this.operations),
    /**
     * Creates a grading for a content block.
     * @param {UpsertUserGrading} args - The grading data to create.
     * @returns {Promise<ContentBlockGrading | undefined>} A promise that resolves with the created content block grading.
     */
    userGrading: this.operations.createGrading.bind(this.operations),
  };

  /**
   * All update operations for content blocks.
   */
  update = {
    /**
     * Updates an existing content block.
     * @param {Object} data - The updated data for the content block.
     * @param {T} data.name - The updated name of the content block.
     * @param {string} data.layerId - The updated ID of the content block layer.
     * @param {ContentBlockSpecsMapping[T]} data.metadata - The updated metadata for the content block.
     * @returns {Promise<UpdateContentBlock<T> | undefined>} A promise that resolves with the updated content block data.
     */
    block: this.operations.updateBlock.bind(this.operations),
    /**
     * Reorders content blocks within a layer.
     * @param {string} layerId - The ID of the content block layer to reorder blocks within.
     * @param {Array<{ id: string; position: number }>} contentBlocks - An array of objects representing content blocks and their new positions.
     * @returns {Promise<ContentBlock[]>} A promise that resolves with the reordered content blocks.
     */
    order: this.operations.order.bind(this.operations),
    /**
     * Updates the grading for a content block.
     * @param id - The ID of the content block grading to update.
     * @param {UpdateContentBlockFeedback} args - The feedback data to update.
     * @returns {Promise<ContentBlockFeedback | undefined>} A promise that resolves with the updated content block feedback.
     */
    userGrading: this.operations.updateGrading.bind(this.operations),
  };

  /**
   * All get operations for content blocks.
   */
  get = {
    /**
     * Gets an array of registered content block types.
     * @returns {RegisteredContentBlock[]} An array of registered content block types.
     */
    registeredContentBlocks: this.operations.getContentBlockTypes.bind(
      this.operations,
    ),
    /**
     * Gets the metadata for a specific content block type based on its `blockType`.
     * @param {keyof ContentBlockSpecsMapping} blockType - The type of the content block.
     * @returns {RegisteredContentBlock | undefined} The content block, or undefined if not found.
     */
    registeredContentBlockByType: this.operations.getContentBlockType.bind(
      this.operations,
    ),
    /**
     * Gets an array of all categories
     * @returns {ContentBlockCategory[]} An array of all categories
     */
    categories: this.operations.getCategories.bind(this.operations),
    /**
     * Retrieves all content blocks of a specific layer.
     * @param {string} layerId - The ID of the content block layer.
     * @returns {Promise<ContentBlock[]>} A promise that resolves with an array of content blocks belonging to the specified layer.
     */
    allBlocksOfLayer: this.operations.getAllBlocksOfLayer.bind(this.operations),
    /**
     * Retrieves a specific content block by its layer and block ID.
     * @param {string} layerId - The ID of the content block layer.
     * @param {string} blockId - The ID of the content block to retrieve.
     * @returns {Promise<ContentBlock | null>} A promise that resolves with the retrieved content block or null if not found.
     */
    block: this.operations.getBlock.bind(this.operations),
  };

  /**
   * All delete operations for content blocks.
   */
  delete = {
    /**
     * Deletes a content block by its ID.
     * @param {string} blockId - The ID of the content block to delete.
     * @returns {Promise<{ success: true } | undefined>} A promise that resolves with success if the deletion is successful.
     */
    block: this.operations.deleteBlock.bind(this.operations),
    /**
     * Reorders content blocks within a layer.
     * @param {string} layerId - The ID of the content block layer to reorder blocks within.
     * @param {Array<{ id: string; position: number }>} contentBlocks - An array of objects representing content blocks and their new positions.
     * @returns {Promise<ContentBlock[]>} A promise that resolves with the reordered content blocks.
     */
    requirement: this.operations.removeRequirement.bind(this.operations),
  };

  /**
   * Content block actions from the course zustand store.
   */
  zustand = {
    /**
     * Opens the content block editor for a specific content block.
     * @param {string} blockId - The ID of the content block to open the editor for.
     * @throws Will throw an error if the content block is not found in the zustand store.
     */
    open: this.operations.open.bind(this.operations),
    /**
     * Opens the content block overview for a specific content block. (For educators and moderators)
     * @param {string} blockId - The ID of the content block to open the overview for.
     * @throws Will throw an error if the content block is not found in the zustand store.
     */
    openOverview: this.operations.openOverview.bind(this.operations),

    /**
     * Gets the content blocks from the course zustand store.
     * @returns {ContentBlock[]} An array of content blocks.
     */
    getContentBlocks: this.operations.getContentBlocksFromZustand.bind(
      this.operations,
    ),
  };

  /**
   * User Data actions for the contentblock. User data is data that is stored in the content block and is specific to the user.
   * For example, the user's answers to a quiz.
   */
  userStatus = {
    /**
     * Retrieves the all user status for a specific content block.
     * @param {string} blockId - The ID of the content block to retrieve the status for.
     * @param {boolean} includeUserData - Whether to include the user data in the response.
     * @returns {Promise<ContentBlockUserStatus<T>[]>} A promise that resolves with the user status for the content block.
     */
    getForBlock: this.operations.getBlockUserStatus.bind(this.operations),
    /**
     * Retrieves the user status for a specific content block and user.
     * @param {string} userId - The ID of the user to retrieve the status for.
     * @param {string} blockId - The ID of the content block to retrieve the status for.
     * @returns {Promise<ContentBlockUserStatus<T>>} A promise that resolves with the user status for the content block.
     */
    getForUser: this.operations.getBlockUserStatusForSpecificUser.bind(
      this.operations,
    ),
    /**
     * Updates the user status for a specific content block and user.
     * @param {string} userId - The ID of the user to update the status for.
     * @param {string} blockId - The ID of the content block to update the status for.
     * @param {T} data - The updated user data.
     * @returns {Promise<ContentBlockUserStatus<T>>} A promise that resolves with the updated user data for the content block.
     */
    update: this.operations.updateBlockUserStatus.bind(this.operations),
    /**
     * Updates multiple users' status for a specific content block.
     * @param {string} userIds - The ID of the users to update the status for.
     * @param {string} blockId - The ID of the content block to update the status for.
     * @param {T} data - The updated user data.
     * @returns {Promise<boolean>} A promise that resolves with a boolean value.
     */
    updateMultiple: this.operations.updateBlockMultipleUserStatus.bind(
      this.operations,
    ),

    /**
     * Shows the finished celebration for a specific content block
     * and refreshes the course tabs list
     */
    finish: this.operations.finishBlock.bind(this.operations),
  };
}

const contentBlockHandler = new ContentBlockHandler();
export default contentBlockHandler;
