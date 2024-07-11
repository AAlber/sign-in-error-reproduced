import type {
  ContentBlockFeedback,
  ContentBlockUserGrading,
  CourseContentBlockStatus,
} from "@prisma/client";
import { Book, HelpingHand, Sparkles } from "lucide-react";
import type { ContentBlock } from "../../course.types";
import type {
  ContentBlockSpecsMapping,
  GenericContentBlockForm,
} from "./specs.types";
import type { ContentBlockUserStatusOfUser } from "./user-data.types";

/**
 * Represents the structure of a registered content block.
 */
export interface RegisteredContentBlock {
  /** Name of the content block. Eg. Assessment or Hand In */
  name: string;
  /** Description of the content block */
  description: string;
  /** Unique name identifier for the content block. Has to be in the ContentBlockSpecsMapping */
  type: keyof ContentBlockSpecsMapping;
  /** Style associated with the content block. */
  style: ContentBlockStyleType;
  /** Feature status of the content block. */
  status: ContentBlockFeatureStatus;
  /** Description of the content block. */
  hint: string;
  /** Function to run when the contentblock is being opend */
  open: (block: ContentBlock, userStatus: ContentBlockUserStatusOfUser) => void;
  /** Optional category for the content block, if none is provided, the block will be placed in no category */
  category?: ContentBlockCategory;
  /** Custom form that defines the structure of the content block creation modal */
  form?: GenericContentBlockForm;
  /** Optional custom creation function, if none is provided, the default modal will be opened */
  openCustomCreateModal?: () => Promise<void> | void;
  /** Optional function that is called before the content block is created */
  onBeforeCreate?: () => Promise<boolean> | boolean | void | Promise<void>;
  /** Optional options for the content block */
  options: ContentBlockOptions;
  popoverSettings?: ContentBlockPopoverSettings;
}

/**
 * Settings to define the look of the content block popover for a specific content block.
 */
export interface ContentBlockPopoverSettings<T = any> {
  /** Whether the content block popover has an open button. Since a lot content blocks have this it was added to simplify conditions in the popover */
  hasOpenButton: boolean;
  /** Whether the content block popover has a mark as finished button, which allows to student to set the content block once he started it. Since a lot content blocks have this it was added to simplify conditions in the popover */
  hasMarkAsFinishedButton: boolean;
  /** If the block has a custom component (e.g. the handin upload) we register it here */
  customContentComponent?: React.ComponentType<T>;
}

export type ContentBlockOptions = {
  canBePrerequisite: boolean;
  hasUserOverview: boolean;
};

export type ContentBlockFeatureStatus =
  | "public"
  | "beta"
  | "comingsoon"
  | "deprecated";

/**
 * Defines the style properties of a content block.
 */
export interface ContentBlockStyleType {
  /** Icon associated with the content block. Recommend using LucidIcon */
  icon: React.ReactNode;
}

/**
 * Represents the structure of a content block category with predefined properties.
 */
export interface ContentBlockCategory {
  /** Name of the category. */
  name: string;
  /** Icon used to represent the category visually */
  icon: React.ReactNode;
  /** Description of the category in the creation menu. */
  description: string;
}

export type AvailableContentBlockCategories =
  | "InfoMaterials"
  | "ArtificalIntelligence"
  | "UserDeliverables";

/**
 * Predefined content block categories.
 * Similar to ContentBlockSpecsMapping, this allows for type-safe usage of categories.
 */
export const ContentBlockCategories: { [name: string]: ContentBlockCategory } =
  {
    InfoMaterials: {
      name: "info-materials",
      description: "info-materials-description",
      icon: <Book className="h-4 w-4" />,
    },
    UserDeliverables: {
      name: "user-deliverables",
      description: "user-deliverables-description",
      icon: <HelpingHand className="h-4 w-4" />,
    },
    ArtificalIntelligence: {
      name: "artificial-intelligence",
      description: "artificial-intelligence-description",
      icon: <Sparkles className="h-4 w-4" />,
    },
  };

/** arguments we pass into the create content block api handler */
export type CreateContentBlock<T extends keyof ContentBlockSpecsMapping = any> =
  {
    /** generated from client side */
    id: string;
    type: IfAny<T, keyof ContentBlockSpecsMapping, T>;
    name: string;
    description: string;
    layerId: string;
    status: CourseContentBlockStatus;
    specs: ContentBlockSpecsMapping[T];
    dueDate?: Date;
    startDate?: Date;
  };

/** arguments we pass into the update content block api handler */
export type UpdateContentBlock<T extends keyof ContentBlockSpecsMapping = any> =
  (
    | {
        type: IfAny<T, keyof ContentBlockSpecsMapping, T>;
        specs: ContentBlockSpecsMapping[T];
      }
    | { type?: never }
  ) &
    Partial<Omit<ContentBlock, "specs" | "feedbacks" | "userStatus">> & {
      id: string;
    };

/** arguments we pass into the create contentBlock feedback api handler */
export type CreateContentBlockFeedback = Omit<
  ContentBlockFeedback,
  "id" | "createdAt" | "updatedAt" | "userId"
> & {
  layerId: string;
};

/** arguments we pass into the add/remove contentBlockRequirements api handler */
export type UpdateContentBlockRequirements = {
  /** the id of the block to add requirements to */
  blockId: string;
  requirementId: string;
};

/** arguments we pass into the upsertContentBlockRating api handler */
export type UpsertUserGrading = Omit<
  ContentBlockUserGrading,
  "layerId" | "institutionId" | "id" | "graderUserId"
> & { id?: string; text: string };
