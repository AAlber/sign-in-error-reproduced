import ServerAIOperations from "./server-operations";

/**
 * Handles AI budget-related operations.
 */
export class ServerAiHandler {
  private operations: ServerAIOperations;

  /**
   * Constructor for AiBudgetHandler.
   * @param {string} institionId - The institionId ID for which the handler is created.
   */
  constructor(institionId: string) {
    this.operations = ServerAIOperations.getInstance(institionId);
  }

  get get() {
    return {
      status: this.operations.getAIUsageStatus.bind(this.operations),
      openai_assistantThreadMessages:
        this.operations.getOpenAiAssistantThreadMessages.bind(this.operations),
    };
  }

  get generate() {
    return {
      object: this.operations.handleGenerateObjectAIRequest.bind(
        this.operations,
      ),
    };
  }

  get handle() {
    return {
      badBudgetResponse: this.operations.handleBadBudgetResponse.bind(
        this.operations,
      ),
    };
  }

  get create() {
    return {
      usageLog: this.operations.createAIUsageLog.bind(this.operations),
      openai_vectorStore: this.operations.createOpenAiVectorStoreFromFiles.bind(
        this.operations,
      ),
      embedding: this.operations.createEmbedding.bind(this.operations),
      manyEmbeddings: this.operations.createManyEmbeddings.bind(
        this.operations,
      ),
      openai_assistant: this.operations.createOpenAiAssistant.bind(
        this.operations,
      ),
      openai_assistantThread: this.operations.createOpenAiAssistantThread.bind(
        this.operations,
      ),
    };
  }
}
