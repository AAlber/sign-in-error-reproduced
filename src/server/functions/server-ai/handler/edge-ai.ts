import { EdgeAiHandler } from "./edge-ai-handler";

export function getAIEdgeHandler(userId: string): EdgeAiHandler {
  return new EdgeAiHandler(userId);
}
