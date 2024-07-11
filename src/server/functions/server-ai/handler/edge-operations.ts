import type { CoreMessage } from "ai";
import {
  AssistantResponse,
  StreamingTextResponse,
  streamObject,
  streamText,
} from "ai";
import type { RunCreateParamsBaseStream } from "openai/lib/AssistantStream";
import type { ThreadCreateParams } from "openai/resources/beta/threads/threads";
import { env } from "@/src/env/server.mjs";
import { openai } from "@/src/server/singletons/openai";
import type { GenerateObjectRequest } from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";
import type { AIBudgetStatus, SupportedAIModel } from "../../../../types/ai";
import { supportedAiModels } from "../../../../types/ai";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : env.SERVER_URL;

/**
 * Class representing AI operations handled on the edge side
 */
class EdgeAIOperations {
  static instance: EdgeAIOperations;
  userId;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Gets an instance of EdgeAIOperations if it already exists
   * Otherwise creates a new instance of EdgeAIOperations
   * @returns {EdgeAIOperations} The instance of EdgeAIOperations
   */
  static getInstance(userId: string) {
    if (!this.instance) {
      log.info("Creating new EdgeAIOperations instance", {
        userId,
      });
      this.instance = new EdgeAIOperations(userId);
    }
    return this.instance;
  }

  /**
   * Handles a streaming AI request by first checking the user's budget and using the appropriate AI model
   * after the budget check is successful and the AI has streamed the response, it updates the organization's usage based
   * on the total tokens used by the AI model (which is weighted by the AI model's cost)
   * @param {SupportedAIModel} operationData.model - The AI model to use
   * @param {string} operationData.system - The system prompt that sets the behavior or role of the AI model
   * @param {string} [operationData.prompt] - The specific prompt for the AI to respond to (optional), cannot be used with messages.
   * @param {CoreMessage[]} [operationData.messages] - An array of messages to provide context to the AI (optional) cannot be used with prompt.
   * @returns {Promise<StreamingTextResponse|Response>} - The streaming text response or an error response.
   */
  async handleStreamingAIRequest(operationData: {
    model: SupportedAIModel;
    system: string;
    prompt?: string;
    messages?: CoreMessage[];
  }): Promise<StreamingTextResponse | Response> {
    try {
      const { model, system, prompt, messages } = operationData;

      if (prompt && messages) {
        return new Response(
          "Cannot use both prompt and messages at the same time. Please use either prompt or messages.",
          { status: 400 },
        );
      }

      /**
       * Checks if the user has enough AI budget to use the AI model
       * if the bufget is exceeded, it returns a 402 status code
       * if the budget error is unknown, it returns a 500 status code
       * */
      const data = await this.getAiBudgetStatus();
      if (data.status !== "can-use") {
        return this.handleBadBudgetResponse(data);
      }

      /**
       * Gets the AI model configuration based on the provided model identifier together with the cost of the model
       * @param {SupportedAIModel} model - The identifier of the AI model you want to get
       * @returns {AIModel} The configuration of the specified AI model, including its SDK model identifier and its cost.
       */
      const aiModel = supportedAiModels[model];

      /** Streams the AI response based on the provided data. */
      const result = await streamText({
        model: aiModel.sdkModel,
        system,
        prompt,
        messages,
      });

      const userId = this.userId;

      /**
       * Creates a stream from the AI response and handles final usage updates
       * @param {Function} streamOptions.onFinal - A callback function to be called when the stream is finalized.
       * The callback updates the organization usage based on the total tokens used
       * @returns {StreamingTextResponse} - Returns the response containing the streaming text to the user
       */
      const stream = result.toAIStream({
        async onFinal(_) {
          const usage = await result.usage;
          updateOrganizationUsage(userId, model, usage.totalTokens);
        },
      });
      return new StreamingTextResponse(stream);
    } catch (error) {
      log.error(error, "Error in handleStreamingAIRequest");
      return new Response("Internal server error", { status: 500 });
    }
  }

  /**
   * Streams an object response based on the provided data.
   * The object has a schema that defines and validates the generated object.
   * It's crucial to note that messages and prompt cannot be used together.
   * @template T - The type of the generated object.
   * @param {GenerateObjectRequest<T>} data - The data for generating the AI object.
   * @returns {Promise<ReadableStream<any> | Response>} A promise that resolves to the generated AI object or an error response.
   */
  async handleStreamingObjectAIRequest<T>(
    operationData: GenerateObjectRequest<T>,
  ): Promise<ReadableStream<any> | Response> {
    try {
      const { schema, model, prompt, messages } = operationData;

      if (prompt && messages) {
        return new Response(
          "Cannot use both prompt and messages at the same time. Please use either prompt or messages.",
          { status: 400 },
        );
      }

      // Check AI budget status
      const budgetData = await this.getAiBudgetStatus();
      if (budgetData.status !== "can-use") {
        return this.handleBadBudgetResponse(budgetData);
      }

      // Get AI model configuration
      const aiModel = supportedAiModels[model];
      if (!aiModel) {
        return new Response("Unsupported AI model", { status: 400 });
      }

      // Stream object based on the AI model configuration
      const result = await streamObject({
        model: aiModel.sdkModel,
        system: operationData.system,
        prompt,
        messages,
        schema,
      });

      let closed = false;
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        start(controller) {
          (async () => {
            for await (const partialObject of result.partialObjectStream) {
              if (closed) break;
              const data = `data: ${JSON.stringify(partialObject)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
            controller.close();
          })();
        },
        cancel() {
          closed = true;
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          Connection: "keep-alive",
          "Cache-Control": "no-cache, no-transform",
          "Content-Encoding": "none",
        },
      });
    } catch (error) {
      console.error("Error in handleStreamingAIRequest", error);
      return new Response("Internal server error", { status: 500 });
    }
  }

  /**
   * Creates a new OpenAI assistant thread.
   * Currently only openai beta assistants are supported.
   * @param {ThreadCreateParams} data - The data to create the OpenAI assistant thread
   */
  async createOpenAiAssistantThread(data?: ThreadCreateParams) {
    const thread = await openai.beta.threads.create(data);
    return thread;
  }

  /**
   * Creates a new message in an OpenAI assistant thread.
   * Currently only openai beta assistants are supported.
   * @param {string} threadId - The ID of the thread to create the message in
   * @param {string} message - The content of the message to create
   */
  async createOpenAiAssistantThreadMessage(threadId: string, message: string) {
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    return createdMessage;
  }

  /**
   * Runs a stream for an OpenAI assistant thread.
   * This function takes in all existing messages and lets the assistant run on the thread.
   * Read these two links for better understanding:
   * @link https://platform.openai.com/docs/assistants/how-it-works
   * @link https://sdk.vercel.ai/docs/ai-sdk-ui/openai-assistants
   */
  handleStreamingOpenAiAssistantThread(
    threadId: string,
    lastMessageId: string,
    body: RunCreateParamsBaseStream,
  ) {
    return AssistantResponse(
      { threadId, messageId: lastMessageId },
      async ({ forwardStream }) => {
        // Run the assistant on the thread
        const runStream = openai.beta.threads.runs.stream(threadId, body);

        // forward run status would stream message deltas
        const runResult = await forwardStream(runStream);

        while (
          runResult?.status !== "failed" &&
          runResult?.status !== "cancelled" &&
          runResult?.status !== "expired" &&
          runResult?.status !== "requires_action"
        ) {
          if (runResult?.status === "completed") {
            const tokens = runResult?.usage?.total_tokens ?? 0;
            await this.updateOrganizationUsage(
              runResult?.model as SupportedAIModel,
              tokens,
            );
            break;
          }
        }
      },
    );
  }

  /**
   * Gets the AI budget status.
   * This function makes an API call because Prisma does not work on the edge side,
   * so it does this to a serverless function to handle the budget update and return the budget status
   * @returns {Promise<AIBudgetStatus>} The AI budget status.
   */
  async getAiBudgetStatus(): Promise<AIBudgetStatus> {
    try {
      const response = await fetch(
        `${baseURL}/api/ai/budget/get-budget-status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.FUXAM_SECRET}`,
          },
          body: JSON.stringify({ userId: this.userId }),
        },
      );

      if (response.status !== 200) {
        const data = await response.json();
        log.warn("Unexpected response status", {
          status: response.status,
          message: data.message,
        });
        throw new Error(data.message);
      }

      log.info("Successfully retrieved AI instance with budget status");
      return await response.json();
    } catch (error) {
      console.log("error", error);
      log.error(error, "Error getting AI instance with budget status");
      return { status: "budget-error" };
    }
  }

  /**
   * Checks the AI budget status
   * if the user has not enough budget, it returns a 402 status code
   * if the budget error is unknown, it returns a 500 status code
   */

  handleBadBudgetResponse(data: AIBudgetStatus) {
    if (data.status === "budget-exceeded") {
      return new Response("Budget exceeded", { status: 402 });
    }
    return new Response("Unknown budget error", { status: 500 });
  }

  /**
   * Updates the organization's AI usage by adding the specified number of tokens used by the user.
   * This function makes an API call because Prisma does not work on the edge side,
   * so it does this to a serverless function to handle the budget update.
   */
  async updateOrganizationUsage(model: SupportedAIModel, tokens: number) {
    return await updateOrganizationUsage(this.userId, model, tokens);
  }
}

/**
 * Updates the organization's AI usage by adding the specified number of tokens used by the user.
 * This function makes an API call because Prisma does not work on the edge side,
 * so it does this to a serverless function to handle the budget update and return the budget status
 * @returns {Promise<boolean>} A boolean indicating whether the usage update was successful
 */
async function updateOrganizationUsage(
  userId: string,
  model: SupportedAIModel,
  tokens: number,
): Promise<boolean> {
  try {
    log.context("Request Data", { userId, tokens });

    if (!supportedAiModels[model]) {
      log.warn("Unsupported AI model", { model });
      throw new Error("Unsupported AI model");
    }

    const response = await fetch(
      `${baseURL}/api/ai/budget/update-budget-status`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.FUXAM_SECRET}`,
        },
        body: JSON.stringify({ userId, tokens, model }),
      },
    );

    if (response.status !== 200) {
      const data = await response.json();
      log.warn("Unexpected response status", {
        status: response.status,
        message: data.message,
      });
      throw new Error(data.message);
    }

    log.info("Successfully added tokens to organization usage");
    return true;
  } catch (error) {
    console.log("error", error);
    log.error(error, "Error adding tokens to organization usage");
    return false;
  }
}

export default EdgeAIOperations;
