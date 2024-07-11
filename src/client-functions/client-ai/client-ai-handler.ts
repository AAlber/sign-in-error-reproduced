import { ClientAIOperations } from "./operations";

export class ClientAIHandler {
  private operations = ClientAIOperations.getInstance();

  create = {
    openai_assistant: this.operations.createOpenAiAssistant.bind(
      this.operations,
    ),
  };

  generate = {
    object: this.operations.generateObject.bind(this.operations),
  };

  handle = {
    response: this.operations.handleResponse.bind(this.operations),
  };
}
const ai = new ClientAIHandler();
export default ai;
