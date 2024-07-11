import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { NextApiRequest } from "next";
import { openai } from "@/src/server/singletons/openai";
import { sentry } from "@/src/server/singletons/sentry";
import { respondToPreflightEdgeRequest } from "@/src/utils/utils";
import type { ConciergeContext } from "./functions";
import { handleToolCalls } from "./tool-call-handler";
import { concierceTools } from "./tools";

export const runtime = "edge";

export default async function POST(req: Request) {
  if (req.method === "OPTIONS") return respondToPreflightEdgeRequest(req);
  const { userId } = getAuth(req as unknown as NextApiRequest);

  if (!userId) return new Response("No user id", { status: 401 });

  const data: { messages: any; context: ConciergeContext } = await req.json();

  sentry.setContext("Concierge", {
    userId,
    context: data.context,
    messages: data.messages,
  });

  sentry.addBreadcrumb({ message: "Checking for possible tool calls." });

  const functionCallerResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "The current time is: " + new Date().toISOString(),
      },
      ...data.messages,
    ],
    tools: concierceTools,
    tool_choice: "auto",
  });

  sentry.addBreadcrumb({ message: "Received function caller response." });

  const responseMessage = functionCallerResponse.choices[0]!.message;
  const toolCalls = responseMessage.tool_calls;

  console.log("Tool calls", toolCalls);

  sentry.addBreadcrumb({ message: "Handling tool calls.", data: toolCalls });

  const toolResponse = await handleToolCalls(userId, data.context, toolCalls);

  sentry.addBreadcrumb({ message: "Handling main function call." });

  const messagesWithFunctionCallData = [
    {
      role: "system",
      content:
        "You can only answer in highly formatted markdown text, you can provide code if asked to. But still always answer in sentences to make it readable. If there are any urls provided, always use them as references, but do not alter them in any way.",
    },
    ...data.messages,
    responseMessage,
    ...(toolResponse ?? []),
  ];

  sentry.addBreadcrumb({
    message: "Sending response.",
    data: messagesWithFunctionCallData,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    stream: true,
    messages: messagesWithFunctionCallData,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
