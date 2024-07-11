import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { getAIEdgeHandler } from "@/src/server/functions/server-ai/handler/edge-ai";

export const runtime = "edge";

export default async function POST(req: Request) {
  const input: {
    threadId: string | null;
    message: string;
    assistantId: string;
  } = await req.json();

  const { userId } = getAuth(req as unknown as NextApiRequest);

  const aiHandler = getAIEdgeHandler(userId!);
  const threadId =
    input.threadId ?? (await aiHandler.create.openai_assistantThread()).id;

  const createdMessage = await aiHandler.create.openai_assistantThreadMessage(
    threadId,
    input.message,
  );

  return aiHandler.stream.openai_assistantThread(threadId, createdMessage.id, {
    assistant_id: input.assistantId,
  });
}
