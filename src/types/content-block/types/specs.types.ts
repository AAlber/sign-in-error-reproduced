import type { AutoLessonChapter as AutoLessonChapter } from "../../ai/ai-request-response.types";
import type { SurveySpecs } from "../../survey.types";

/**
 * Mapping of content block names to their respective specs types.
 * This allows TypeScript to infer the correct specs type based on the block name.
 */
export type ContentBlockSpecsMapping = {
  HandIn: HandInSpecs;
  File: FileSpecs;
  ProtectedFile: ProtectedFileSpecs;
  StaticWorkbenchFile: StaticWorkbenchFileSpecs;
  Assessment: AssessmentSpecs;
  AutoLesson: AutoLessonSpecs;
  Video: VideoSpecs;
  DocuChat: DocuChatSpecs;
  EditorFile: EditorFileSpecs;
  Link: LinkSpecs;
  Survey: SurveySpecs;
  ExternalDeliverable: any;
  Audio: AudioSpecs;
  /** Available soon */
  Certificate: any;
  Section: any;
};

/**
 * Definintion of the specs structure of contentblocks
 */

export interface HandInSpecs {
  allowedFileTypes: string;
  isSharedSubmission: boolean;
  isGroupSubmission: boolean;
}

export interface AudioSpecs {
  audioFileUrl: string;
  type: SupportedAudioType;
}
export interface StaticWorkbenchFileSpecs {
  content: string;
}

export interface AssessmentSpecs {
  content: string;
}

export interface FileSpecs {
  files: string[];
  isProtected: boolean;
}

export interface VideoSpecs {
  videoUrl: string;
  type: SupportedVideoType;
  showVideoControls: boolean;
}

export interface ProtectedFileSpecs {
  fileUrl: string;
}

export interface AutoLessonSpecs {
  assistantId: string;
  minMessagesPerChapter: number;
  chapters: AutoLessonChapter[];
  fileUrls: string[];
}

export interface EditorFileSpecs {
  content: string;
}

export interface DocuChatSpecs {
  assistantId: string;
  fileUrl: string;
}

export type LinkSpecs = {
  url: string;
};

export type ExternalDeliverableSpecs = {
  studentCanMarkAsFinished: boolean;
};

/**
 * Definintion of the form structure of contentblocks
 */
export type ContentBlockFormField<T> = T extends object
  ? {
      [P in keyof T]:
        | {
            label: string;
            description?: string;
            fieldType: "input" | "switch" | "number";
            defaultValue: T[P];
            verification?: (value: T[P]) => string | null;
            advanced?: boolean;
          }
        | {
            label: string;
            description?: string;
            defaultValue: T[P];
            fieldType: "select";
            options: string[];
            advanced?: boolean;
          }
        | {
            label: string;
            description?: string;
            fieldType: "custom";
            advanced?: boolean;
          }
        | {
            label: string;
            description?: string;
            fieldType: "file";
            allowedFileTypes: string[];
            advanced?: boolean;
          }
        | {
            fieldType: "hidden";
            advanced?: false;
          }
        | null;
    }
  : never;

export type ContentBlockForm<T> = ContentBlockFormField<T>;
export type GenericContentBlockForm = ContentBlockForm<
  ContentBlockSpecsMapping[keyof ContentBlockSpecsMapping]
>;
