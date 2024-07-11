import { zodToJsonSchema } from "zod-to-json-schema";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { log } from "@/src/utils/logger/logger";
import type {
  CreateAssistantRequest as CreateOpenAiAssistantRequest,
  CreateAssistantResponse as CreateOpenAiAssistantResponse,
  GenerateObjectRequest,
  GenerateObjectResponse,
} from "../../types/ai/ai-request-response.types";
import { toastNotEnoughAICredits } from "../client-utils";

export class ClientAIOperations {
  private static instance: ClientAIOperations;

  static getInstance(): ClientAIOperations {
    if (!ClientAIOperations.instance) {
      ClientAIOperations.instance = new ClientAIOperations();
    }
    return ClientAIOperations.instance;
  }

  async handleResponse<T>(res: Response | null): Promise<T | null> {
    if (!res || !res.ok) {
      if (res && res.status === 402) {
        log.warn("Not enough AI credits");
        toastNotEnoughAICredits();
      } else if (res && res.status === 413) {
        log.error("Request entity too large");
        toast.warning("entity_too_large_title", {
          description: "entity_too_large_description",
        });
        return null;
      } else if (res) {
        log.response(res);
        log.error("Failed to ai handler request");
        toast.responseError({
          response: res,
          title: "planner.unknown-error",
        });
      } else {
        log.error("Failed to ai handler request - no response");
      }
      return null;
    }

    const data = await res.json();
    return data;
  }

  async handleRequest<T>(route: string, data: any): Promise<T | null> {
    try {
      log.info("Ai handler request", { data });
      const response = await fetch(route, {
        method: "POST",
        body: JSON.stringify(data),
      });
      log.info("Ai handler response", { response });
      return this.handleResponse(response);
    } catch (error) {
      log.error(error);
      toast.error("checkin-unknown-error", {});
      return null;
    }
  }

  async createOpenAiAssistant(data: CreateOpenAiAssistantRequest) {
    const completion = await this.handleRequest<CreateOpenAiAssistantResponse>(
      api.createAssistant,
      data,
    );

    return completion;
  }

  async generateObject<T>(data: GenerateObjectRequest<T>) {
    const object = await this.handleRequest<GenerateObjectResponse<T>>(
      api.generateObject,
      {
        ...data,
        schema: zodToJsonSchema(data.schema, "schema"),
      },
    );

    return object;
  }
}
