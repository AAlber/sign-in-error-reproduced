import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/index.mjs";
import { sentry } from "@/src/server/singletons/sentry";
import type { ConciergeContext } from "./functions";

export async function handleToolCalls(
  userId: string,
  context: ConciergeContext,
  toolCalls: ChatCompletionMessageToolCall[] | undefined,
): Promise<ChatCompletionMessageParam[] | null> {
  const url = `${process.env.SERVER_URL}/api/concierge/data-retrieval`;

  const payload = {
    userId,
    context,
    toolCalls,
  };

  sentry.addBreadcrumb({
    message: "Sending tool call request.",
    data: payload,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FUXAM_SECRET}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    sentry.captureException(new Error("Failed to fetch tool call results"));
    throw new Error("Failed to fetch tool call results");
  }

  sentry.addBreadcrumb({ message: "Received tool call response." });

  const data = await response.json();
  return data;
}
