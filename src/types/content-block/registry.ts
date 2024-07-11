import type { ContentBlock } from "../course.types";
import type {
  AvailableContentBlockCategories,
  ContentBlockCategory,
  ContentBlockFeatureStatus,
  ContentBlockOptions,
  ContentBlockPopoverSettings,
  ContentBlockStyleType,
  RegisteredContentBlock,
} from "./types/cb-types";
import { ContentBlockCategories } from "./types/cb-types";
import type {
  ContentBlockForm,
  ContentBlockSpecsMapping,
} from "./types/specs.types";
import type { ContentBlockUserStatusOfUser } from "./types/user-data.types";

/**
 * Manages the registration and retrieval of different content block types.
 */
export class ContentBlockRegistry {
  private blockTypes = new Map<string, RegisteredContentBlock>();

  /**
   * Registers a new content block type.
   * @param {RegisteredContentBlock} block - The content block to register.
   * @throws Will throw an error if a block with the same name is already registered.
   */
  add(block: RegisteredContentBlock) {
    if (this.blockTypes.has(block.type)) {
      throw new Error(
        `Block type with type ${block.type} is already registered.`,
      );
    }
    this.blockTypes.set(block.type, block);
  }

  /**
   * Retrieves a registered content block by its name.
   * @param {TBlockType} name - The name of the content block to retrieve.
   * @returns {RegisteredContentBlock} The registered content block.
   * @throws Will throw an error if the block with the specified name is not found.
   */
  get<TBlockType extends keyof ContentBlockSpecsMapping>(
    name: TBlockType,
  ): RegisteredContentBlock {
    const block = this.blockTypes.get(name);
    if (!block) {
      throw new Error(`Block type with name ${name} not found.`);
    }
    return block;
  }

  /**
   * Lists the names of all registered blocks.
   * @returns {string[]} An array of registered block names.
   */
  listRegisteredBlocks(): string[] {
    return Array.from(this.blockTypes.keys());
  }

  /**
   * Gets an array of all registered content blocks.
   * @returns {RegisteredContentBlock[]} An array of registered content blocks.
   */
  getRegisteredBlocks(): RegisteredContentBlock[] {
    return Array.from(this.blockTypes.values());
  }

  /**
   * Gets an array of all categories
   * @returns {ContentBlockCategory[]} An array of all categories
   */
  getCategories(): ContentBlockCategory[] {
    return Object.values(ContentBlockCategories);
  }
}

/**
 * Builder for creating and configuring content blocks.
 */
export class ContentBlockBuilder<
  TBlockType extends keyof ContentBlockSpecsMapping,
> {
  private contentBlock: Partial<RegisteredContentBlock> = {};

  constructor(private type: TBlockType) {
    this.contentBlock.type = type;
    this.contentBlock.status = "public";
    this.contentBlock.options = {
      canBePrerequisite: true,
      hasUserOverview: true,
    };
    this.contentBlock.popoverSettings = {
      hasMarkAsFinishedButton: false,
      hasOpenButton: false,
    };
  }

  /**
   * Sets the name of the content block.
   * @param {string} name - The name of the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withName(name: string): ContentBlockBuilder<TBlockType> {
    this.contentBlock.name = name;
    return this;
  }

  /**
   * Sets the style of the content block.
   * @param {ContentBlockStyleType} style - The style type of the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withStyle(style: ContentBlockStyleType): ContentBlockBuilder<TBlockType> {
    this.contentBlock.style = style;
    return this;
  }

  /**
   * Sets the category of the content block using predefined categories.
   * @param {AvailableContentBlockCategories} categoryName - The name of the category to associate with the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withCategory(
    categoryName: AvailableContentBlockCategories,
  ): ContentBlockBuilder<TBlockType> {
    const category = ContentBlockCategories[categoryName];
    if (!category) {
      throw new Error(`Category ${categoryName} not found.`);
    }
    this.contentBlock.category = category;
    return this;
  }

  /**
   * Uses the ContentBlockSpecsMapping to automate the UI creation of form for this contentblock.
   * @param form - The form to use for this content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withForm(
    form: ContentBlockForm<ContentBlockSpecsMapping[TBlockType]>,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.form = form;
    return this;
  }

  /**
   * Define what happens when the content block is opened.
   * @param onOpen - The function to execute when the content block is opened.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withOpeningProcedure(
    onOpen: (
      block: ContentBlock<TBlockType>,
      userStatus: ContentBlockUserStatusOfUser,
    ) => Promise<void> | void,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.open = onOpen as any;
    return this;
  }

  /**
   * If the content block is not created via the default modal,
   * this function can be used to open a custom modal.
   * @param withCustomCreation - The function to open the custom modal.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withCustomCreation(
    withCustomCreation: () => Promise<void> | void,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.openCustomCreateModal = withCustomCreation;
    return this;
  }

  /**
   * Adds procedures to be executed before the content block is created in the database.
   * @param onCreate - The function to execute before the content block is created.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withPreCreationStep(
    onCreate: () => Promise<boolean> | boolean | void | Promise<void>,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.onBeforeCreate = onCreate;
    return this;
  }

  /**
   * If the content block has a special status like "beta" or "coming soon",
   * this function can be used to set the status.
   * @param status - The status of the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withStatus(
    status: ContentBlockFeatureStatus,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.status = status;
    return this;
  }

  /**
   * Adds a description to the content block that will be shown to the student
   * if the content block has no description.
   * @param descriptuin - The description of the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withDescription(description: string): ContentBlockBuilder<TBlockType> {
    this.contentBlock.description = description;
    return this;
  }

  /**
   * Adds a hint to the content block that will be shown to the student
   * if they hover over the block in the learning journey.
   * @param hint - The fallbackDescription of the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withHint(hint: string): ContentBlockBuilder<TBlockType> {
    this.contentBlock.hint = hint;
    return this;
  }

  /**
   * Sets the options for the content block.
   * @param options - The options for the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withOptions(options: ContentBlockOptions): ContentBlockBuilder<TBlockType> {
    this.contentBlock.options = options;
    return this;
  }

  /**
   * Sets the popover settings for the content block.
   * To control the render of "Open" button, "Mark as finished" button, and
   * rendering custom component for the content block.
   * @param popoverSettings - The popover settings for the content block.
   * @returns {ContentBlockBuilder} This builder instance for chaining.
   */
  withPopoverSettings(
    popoverSettings: ContentBlockPopoverSettings,
  ): ContentBlockBuilder<TBlockType> {
    this.contentBlock.popoverSettings = popoverSettings;
    return this;
  }

  /**
   * Builds and returns the configured content block.
   * @returns {RegisteredContentBlock} The configured content block.
   * @throws Will throw an error if the content block is missing a style.
   */
  build(): RegisteredContentBlock {
    if (!this.contentBlock.style) {
      throw new Error(
        `Missing style for content block '${this.contentBlock.type}'`,
      );
    }

    if (!this.contentBlock.name) {
      throw new Error(
        `Missing name for content block '${this.contentBlock.type}'`,
      );
    }

    if (!this.contentBlock.status) {
      throw new Error(
        `Missing status for content block '${this.contentBlock.type}'`,
      );
    }

    if (!this.contentBlock.description) {
      throw new Error(
        `Missing description for content block '${this.contentBlock.type}'`,
      );
    }

    if (!this.contentBlock.hint) {
      throw new Error(
        `Missing fallbackDescription for content block '${this.contentBlock.type}'`,
      );
    }

    if (!this.contentBlock.type) {
      throw new Error(
        `Missing type for content block '${this.contentBlock.type}'`,
      );
    }

    return this.contentBlock as RegisteredContentBlock;
  }
}
