import { mistral } from "@ai-sdk/mistral";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type SupportedAIModel = "gpt-3.5-turbo" | "gpt-4o" | "open-mixtral-8x7b";

export type SupportedOpenAIModels = Extract<
  SupportedAIModel,
  "gpt-3.5-turbo" | "gpt-4o"
>;

export type AIModel = {
  sdkModel: LanguageModel;
  cost: number;
};

type AIModelMap = Record<SupportedAIModel, AIModel>;

export const supportedAiModels: AIModelMap = {
  "gpt-3.5-turbo": {
    sdkModel: openai("gpt-3.5-turbo"),
    cost: 1,
  },
  "gpt-4o": {
    sdkModel: openai("gpt-4o"),
    cost: 10,
  },
  "open-mixtral-8x7b": {
    sdkModel: mistral("open-mixtral-8x7b"),
    cost: 0.27,
  },
};

export type AIBudgetStatus =
  | {
      status: "can-use" | "budget-exceeded";
      percentageUsed: number;
      budget: number;
      usage: number;
    }
  | {
      status: "budget-error";
    };

export type AIUsageReport = {
  usage: number;
  percentageUsed: number;
  budget: number;
};
