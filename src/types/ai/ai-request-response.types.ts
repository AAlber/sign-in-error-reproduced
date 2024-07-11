import type { CoreMessage } from "ai";
import { z } from "zod";
import type {
  AIBudgetStatus,
  SupportedAIModel,
  SupportedOpenAIModels,
} from "@/src/types/ai";

export type CreateAssistantRequest = {
  model: SupportedOpenAIModels;
  instructions: string;
  fileUrls?: string[];
};

export type CreateAssistantResponse =
  | {
      ok: true;
      assistantId: string;
    }
  | {
      ok: false;
      message: string;
      budget?: number;
      usage?: number;
    };

/** Request to generate a typed object using the AI. */
export type GenerateObjectRequest<T> = {
  /** The AI model to use */
  model: SupportedAIModel;
  /**
   * The schema to define and validate the generated object. The return will be types
   * based on this schem.a
   */
  schema: z.Schema<T>;
  /** System message to provide context to the AI */
  system: string;
  /** Optional messages to provide context, cannot be provided with prompt */
  messages?: CoreMessage[];
  /** Optional prompt to guide the AI, cannot be provided with messages */
  prompt?: string;
};

export type GenerateObjectResponse<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "budget-exceeded";
      code: number;
      data: AIBudgetStatus;
    }
  | {
      status: "error";
      code: number;
      error: string;
    };

export type GenerateChaptersRequest = {
  fileUrls: string[];
};

export type AutoLessonChapter = {
  id: string;
  title: string;
  description: string;
};

export type GenerateChaptersResponse = {
  chapters: AutoLessonChapter[];
  fileUrls: string[];
};

export type GenerateChapterQuestionsResponse =
  | {
      ok: true;
      questionData: ChapterQuestionData;
    }
  | {
      ok: false;
      message: string;
    };

export type ChapterQuestionData = {
  question: {
    text: string;
    answers: {
      text: string;
      isCorrect: boolean;
    }[];
  };
  enoughContentForQuestion: boolean;
};

export const GenerateAppointmentDataSchema = z.object({
  dateTime: z.string(),
  duration: z.number(),
  rrule: z.string().optional(),
})

export type GenerateAppointmentData = z.infer<typeof GenerateAppointmentDataSchema>;