import EdgeAIOperations from "./edge-operations";

/**
 * Handles all operations suited for the edge environment.
 * E.g. streaming AI requests.
 */
export class EdgeAiHandler {
  private operations: EdgeAIOperations;

  constructor(userId: string) {
    this.operations = EdgeAIOperations.getInstance(userId);
  }

  get stream() {
    return {
      object: this.operations.handleStreamingObjectAIRequest.bind(
        this.operations,
      ),
      text: this.operations.handleStreamingAIRequest.bind(this.operations),
      openai_assistantThread:
        this.operations.handleStreamingOpenAiAssistantThread.bind(
          this.operations,
        ),
    };
  }

  get create() {
    return {
      openai_assistantThread: this.operations.createOpenAiAssistantThread.bind(
        this.operations,
      ),
      openai_assistantThreadMessage:
        this.operations.createOpenAiAssistantThreadMessage.bind(
          this.operations,
        ),
    };
  }

  get update() {
    return {
      organizationUsage: this.operations.updateOrganizationUsage.bind(
        this.operations,
      ),
    };
  }
}
