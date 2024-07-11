import { openai as vercelSDKOpenAi } from "@ai-sdk/openai";
import type { Message } from "ai";
import { embed, embedMany, generateObject } from "ai";
import axios from "axios";
import { toFile } from "openai";
import type { Assistant } from "openai/resources/beta/assistants";
import type { Thread } from "openai/resources/beta/threads/threads";
import { basename } from "path";
import { openai } from "@/src/server/singletons/openai";
import type {
  GenerateObjectRequest,
  GenerateObjectResponse,
} from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";
import type {
  AIBudgetStatus,
  SupportedAIModel,
  SupportedOpenAIModels,
} from "../../../../types/ai";
import { supportedAiModels } from "../../../../types/ai";
import { prisma } from "../../../db/client";

/**
 * Class representing operations related to AI budget management.
 */
class ServerAIOperations {
  static instance: ServerAIOperations;
  institutionId;

  /**
   * Create a new instance of AiBudgetOperations.
   * @param {string} instiId - The institution ID for which the operations will be performed.
   */
  constructor(instiId?: string) {
    if (!instiId) return;
    if (instiId.length === 0) {
      log.error("No institution id provided for ai server operations");
      throw new Error("No institution id provided for ai server operations");
    }
    this.institutionId = instiId;
  }

  /**
   * Get the instance of AiBudgetOperations or create a new one if it doesn't exist.
   * @param {string} instiId - The institution ID for which the operations will be performed.
   * @returns {ServerAIOperations} - The AiBudgetOperations instance.
   */
  static getInstance(instiId: string) {
    if (!this.instance) {
      log.info("Creating new ServerAIOperations instance", {
        institutionId: instiId,
      });
      this.instance = new ServerAIOperations(instiId);
    }
    return this.instance;
  }

  /**
   * Get the current AI usage in credits.
   * @returns {Promise<number>} - The current AI usage in credits.
   */
  async getCurrentUsage() {
    log.info("Getting current AI usage", { institutionId: this.institutionId });
    const logs = await prisma.institutionAIUsageLog.findMany({
      where: {
        institutionId: this.institutionId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const credits = logs.reduce((acc, log) => acc + log.creditsSpent, 0);
    log.info("Current AI usage", {
      institutionId: this.institutionId,
      credits,
    });
    return credits;
  }

  /**
   * Gets the current AI usage in credits.
   * @interface ServerAiHandlerInterface
   * @property {Object} get - The object containing the server-side AI handler methods.
   * @property {Function} get.status - A function that retrieves the AI budget status.
   * @returns {Promise<AIBudgetStatus & { id: string }>} A promise that resolves to an object containing the AI budget status and the ID.
   * The returned object includes properties from the AIBudgetStatus interface with the id property.
   */
  async getAIUsageStatus(): Promise<AIBudgetStatus & { id: string }> {
    try {
      log.info("Getting AI usage status", {
        institutionId: this.institutionId,
      });
      const status = await prisma.institutionAIUsageStatus.findFirst({
        where: { institutionId: this.institutionId },
      });

      if (!status) {
        log.info("Creating new AI usage status", {
          institutionId: this.institutionId,
        });
        const newStatus = await prisma.institutionAIUsageStatus.create({
          data: {
            institutionId: this.institutionId,
          },
        });
        return {
          id: newStatus.id,
          budget: newStatus.budget,
          usage: 0,
          percentageUsed: 0,
          status: "can-use",
        };
      }
      const usage = await this.getCurrentUsage();
      const percentageUsed =
        usage >= status.budget ? 100 : (usage / status.budget) * 100;

      log.info("AI usage status", {
        institutionId: this.institutionId,
        status: { id: status.id, budget: status.budget, usage, percentageUsed },
      });
      return {
        id: status.id,
        budget: status.budget,
        percentageUsed,
        usage: usage,
        status: percentageUsed < 100 ? "can-use" : "can-use",
      };
    } catch (error) {
      log.error(error);
      return { status: "budget-error", id: "" };
    }
  }

  /**
   * Handles specific responses when the AI budget status is exceeded or unknown.
   * @param {AIBudgetStatus} data - The AI budget status data.
   * @returns {Promise<any>} A promise that resolves after handling the response.
   * It either notifies the user of not enough budgets or logs an error based on the budget status.
   */ handleBadBudgetResponse(data: AIBudgetStatus) {
    if (data.status === "budget-exceeded") {
      return {
        status: "budget-exceeded",
        code: 402,
        data,
      };
    }
    return {
      status: "error",
      code: 500,
      error: "Unknown budget error",
    };
  }

  /**
   * Logs the AI model usage with the tokens and updates the AI budget based on the model that was used.
   * @param {number} tokens - The number of tokens used.
   * @param {SupportedAIModel} model - The AI model used.
   * @returns {Promise<{ budget: number; usage: number }>} A promise that resolves to the updated budget and usage.
   * The response includes the new budget status and the usage details
   */
  async createAIUsageLog(tokens: number, model: SupportedAIModel) {
    try {
      log.info("Creating AI usage log", {
        institutionId: this.institutionId,
        tokens,
      });

      // Gets the AI model configuration based on the provided model identifier along with the cost of the model
      const aiModel = supportedAiModels[model];

      // Calculates the number of tokens spent by multiplying the cost associated to the specific AI model with the tokens
      const weightedTokens = aiModel.cost * tokens;

      log
        .info("Weighted tokens for the model " + model, { weightedTokens })
        .cli();

      // Gets the current AI usage budget status and checks the status for errors or exceeded
      const status = await this.getAIUsageStatus();
      if (status.status === "budget-error") {
        log.warn("Error getting AI usage status", {
          institutionId: this.institutionId,
        });
        throw new Error("Error getting AI usage status");
      }
      if (status.status === "budget-exceeded") {
        log.warn("Budget exceeded", {
          institutionId: this.institutionId,
          budget: status.budget,
          usage: status.usage,
        });
        return {
          budget: status.budget,
          usage: status.usage,
        };
      }

      // Create a new entry in the institutionAIUsageLog table using Prisma ORM with the budget status, correct institution ID, date, and the number of tokens spent
      await prisma.institutionAIUsageLog.create({
        data: {
          statusId: status.id,
          institutionId: this.institutionId,
          date: new Date(),
          creditsSpent: weightedTokens,
        },
      });

      log.info("AI usage log created", {
        institutionId: this.institutionId,
        credits: tokens,
        budget: status.budget,
        usage: status.usage + weightedTokens,
      });

      // Updates the AI budget status and the usage by adding the used tokens to the it
      return {
        budget: status.budget,
        usage: status.usage + weightedTokens,
      };
    } catch (error) {
      log.error(error);

      // Return a default budget and usage indicating failure
      return { budget: 0, usage: 0 };
    }
  }

  /**
   * Opens an OpenAI vector store using the provided URL.
   * @param {string} fileUrls - File URLs to create the vector store from.
   * @returns {Promise<VectorStore>} A promise that resolves to the opened vector store.
   */
  async createOpenAiVectorStoreFromFiles(fileUrls: string[]) {
    log.info("Creating vector store from files", fileUrls);
    try {
      const files = await Promise.all(
        fileUrls.map((url) => this.downloadFile(url)),
      );

      const vectorStore = await openai.beta.vectorStores.create({});

      await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
        files,
      });

      log.info("Vector store created");

      return vectorStore;
    } catch (error) {
      log.error(error, "Error getting vector store from file");
      return null;
    }
  }

  async downloadFile(fileUrl: string) {
    const response = await axios.get<Buffer>(
      decodeURIComponent(fileUrl) + "?isFolder=false",
      {
        headers: {
          "X-CF-Secret": process.env.R2_AUTH_KEY_SECRET as string,
        },
        responseType: "arraybuffer",
      },
    );

    const filename = basename(fileUrl); // extract the filename from url
    return await toFile(response.data, filename); // create a File object from buffer
  }

  /**
   * Generates an AI server side response based on the provided data.
   * The object has a schema that defines and validates the generated object.
   * Its crucial to note that messages and prompt can not be used together
   * @template T - The type of the generated object.
   * @param {GenerateObjectRequest<T>} data - The data for generating the AI object.
   * @returns {Promise<GenerateObjectResponse<T>>} A promise that resolves to the generated AI object.
   */
  async handleGenerateObjectAIRequest<T>(
    data: GenerateObjectRequest<T>,
  ): Promise<GenerateObjectResponse<T>> {
    const { model, schema, system, messages, prompt } = data;
    console.log(data);
    try {
      // Checks the AI budget status to determine if the AI model can be used
      const data = await this.getAIUsageStatus();

      // If the budget status indicates that the budget has been exceeded, returns a 402 status code
      if (data.status !== "can-use")
        return this.handleBadBudgetResponse(data) as GenerateObjectResponse<T>;

      // Gets the AI model details, including the cost of the AI model, based on the provided model identifier
      const aiModel = supportedAiModels[model];

      // Generates an object with the system context for the AI model, the specific AI model to use,
      // the schema to validate the generated object, the optional prompt to guide the AI, and the optional messages to include in the AI request
      const result = await generateObject({
        system,
        model: aiModel.sdkModel,
        schema,
        prompt,
        mode: "json",
        messages,
      });

      // Log the AI usage with the total tokens used and the model
      await this.createAIUsageLog(result.usage.totalTokens, model);

      return {
        status: "success",
        data: result.object,
      };
    } catch (error) {
      log.error(error, "Error in handleGenerateObjectAIRequest").cli();
      return {
        status: "error",
        code: 500,
        error: "Internal server error in handleGenerateObjectAIRequest",
      };
    }
  }

  /**
   * Creates an embedding from the given text.
   * @param {string} text - The text to convert into an embedding.
   * @returns {Promise<number[]>} A promise that resolves to an array of numbers.
   * This array represents the embedding of the text, which can be used for tasks like finding similar texts, grouping texts together, or classifying them.
   */
  async createEmbedding(value: string) {
    const { embedding } = await embed({
      // Specifing the model to use for creating the embedding and the text (value) for which the embedding is to be created
      model: vercelSDKOpenAi.embedding("text-embedding-3-small"),
      value,
    });

    // Returns the resulting embedding (an array of numbers)
    return embedding;
  }

  /**
   * Creates multiple embeddings from the given texts.
   * @param {string[]} texts - An array of texts to convert into embeddings.
   * @returns {Promise<number[][]>} A promise that resolves to an array of arrays of numbers.
   * Each inner array represents the embedding of the corresponding text.
   * These embeddings can be used for tasks like finding similar texts, grouping texts together, or classifying them.
   */
  async createManyEmbeddings(values: string[]) {
    const { embeddings } = await embedMany({
      model: vercelSDKOpenAi.embedding("text-embedding-3-small"),
      values,
    });

    return embeddings;
  }

  /**
   * Creates an OpenAI assistant using the provided data.
   * Currently only openai beta assistants are supported.
   * @param {Object} data - The data for creating the assistant.
   * @param {string} data.instructions - The instructions for the assistant.
   * @param {SupportedAIModel} data.model - The AI model to use.
   * @param {string} [data.vectorStoreId] - The ID of the vector store to use.
   * @returns {Promise<{ ok: boolean; assistant: Assistant }>} A promise that resolves to the created assistant.
   */
  async createOpenAiAssistant(data: {
    instructions: string;
    model: SupportedOpenAIModels;
    vectorStoreId?: string;
  }): Promise<
    { ok: true; assistant: Assistant } | { ok: false; message: string }
  > {
    try {
      const hasVectorStore = data.vectorStoreId !== undefined;

      const assistant = await openai.beta.assistants.create({
        instructions: data.instructions,
        model: data.model,
        tools: hasVectorStore ? [{ type: "file_search" }] : [],
        tool_resources: hasVectorStore
          ? { file_search: { vector_store_ids: [data.vectorStoreId!] } }
          : {},
      });

      if (!assistant) {
        throw new Error("Failed to create assistant. Assistant is undefined.");
      }

      return { ok: true, assistant };
    } catch (error) {
      log.error(error, "Error creating assistant");
      return { ok: false, message: "An error occurred. Error: " + error };
    }
  }

  /**
   * Opens an OpenAI assistant thread.
   * Currently only openai beta assistant threads are supported.
   * @returns {Promise<Thread>} A promise that resolves to the opened assistant thread.
   */
  async createOpenAiAssistantThread(): Promise<Thread> {
    const thread = await openai.beta.threads.create();
    return thread;
  }

  /**
   * Gets the messages from an OpenAI assistant thread.
   * Currently only openai beta assistant threads are supported.
   * @returns {Promise<Message>} A promise that resolves to the messages (type Message from vercel ai sdk).
   */
  async getOpenAiAssistantThreadMessages(threadId: string): Promise<Message[]> {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data.reverse().map(
      (message) =>
        ({
          id: message.id,
          content: message.content
            .filter((content) => content.type === "text")
            .map((c) => {
              if (c.type === "text") return c.text.value;
              return "";
            })
            .join(""), // Only text content is supported
          role: message.role,
        }) satisfies Message,
    );
  }

  // createTempFile(fileBuffer: Buffer) {
  //   tmp.file((err, path, fd, cleanupCallback) => {
  //     if (err) throw err;

  //     fs.writeFile(path, fileBuffer, (err) => {
  //       if (err) throw err;
  //       console.log("File written to", path);

  //       // Use the temporary file path for further processing

  //       // Cleanup the temporary file when done
  //       cleanupCallback();
  //     });
  //   });
  // }
}

export default ServerAIOperations;
