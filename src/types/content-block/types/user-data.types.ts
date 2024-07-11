import type { ContentBlockUserGrading, UserStatus } from "@prisma/client";
import type { SurveyAnswer } from "../../survey.types";

export type UserDataForBlock<T extends keyof ContentBlockUserDataMapping> =
  ContentBlockUserDataMapping[T];

export interface ContentBlockUserStatus<
  T extends keyof ContentBlockUserDataMapping | undefined = undefined,
> extends SimpleUser {
  status: UserStatus;
  rating?: ContentBlockUserGrading;
  userData?: T extends keyof ContentBlockUserDataMapping
    ? UserDataForBlock<T>
    : undefined;
}

export interface ContentBlockUserStatusOfUser<
  T extends keyof ContentBlockUserDataMapping | undefined = undefined,
> {
  status: UserStatus;
  rating?: ContentBlockUserGrading;
  userData?: T extends keyof ContentBlockUserDataMapping
    ? UserDataForBlock<T>
    : undefined;
  graderProfile?: Pick<SimpleUser, "name" | "image" | "id">;
}

export interface UpdateContentBlockUserStatusRequest<
  T extends keyof ContentBlockUserDataMapping,
> {
  blockId: string;
  data: Partial<ContentBlockUserStatusOfUser<T>>;
  userId?: string;
}

export interface GetContentBlockUserOfUserStatusRequest {
  blockId: string;
  userId?: string;
}

export interface UpdateContentBlockMultipleUserStatusRequest<
  T extends keyof ContentBlockUserDataMapping,
> {
  blockId: string;
  data: Partial<ContentBlockUserStatusOfUser<T>>;
  userIds: string[];
}

/**
 * Mapping of content block names to their respective user data types.
 * Similar to ContentBlockSpecsMapping, this allows for type-safe access
 * to user data based on the block name.
 */
export type ContentBlockUserDataMapping = {
  HandIn: HandInUserData;
  Assessment: AssessmentUserData;
  File: FileUserData;
  StaticWorkbenchFile: StaticWorkbenchFileUserData;
  AutoLesson: AutoLessonUserData;
  ProtectedFile: ProtectedFileUserData;
  Video: VideoUserData;
  DocuChat: DocuChatUserData;
  EditorFile: EditorFileUserData;
  Link: LinkUserData;
  Survey: SurveyUserData;
  ExternalDeliverable: ExternalDeliverableUserData;
  Certificate: any;
  Section: any;
  Audio: AudioUserData;
};

/**
 * Definintion of the user data structure of contentblocks
 */
export interface HandInUserData {
  url: string;
  uploadedAt: Date | undefined;
  comment: string;
  uploadedByPeer?: string;
  peerUserId?: string;
}

export interface AudioUserData {
  secondsListened: number;
  listenedPercentage: number;
  lastListenedAt: Date;
}

export interface DocuChatUserData {
  threadId: string;
  messageCount: number;
}

export interface AssessmentUserData {
  content: string;
  lastEditedAt: Date;
}

export interface FileUserData {
  downloadedAt: Date;
}

export interface VideoUserData {
  secondsWatched: number;
  watchedPercentage: number;
  lastWatchedAt: Date;
}

export interface ProtectedFileUserData {
  viewedAt: Date;
}

export interface StaticWorkbenchFileUserData {
  lastViewedAt: Date;
  content?: string;
}

export interface EditorFileUserData {
  lastViewedAt: Date;
  comments: string[];
}

export interface AutoLessonUserData {
  chapters: {
    chapterId: string;
    unlocked: boolean;
    threadId: string;
    finished: boolean;
  }[];
}

export interface LinkUserData {
  lastViewed: Date;
}

export interface SurveyUserData {
  answers: SurveyAnswer[];
  answeredAt: Date;
}
export interface ExternalDeliverableUserData {
  markedAsFinishedDate: Date | null;
}
