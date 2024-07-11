import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { getAIEdgeHandler } from "@/src/server/functions/server-ai/handler/edge-ai";

export const runtime = "edge";

export default async function POST(req: Request) {
  const input: {
    threadId: string;
    message: string;
    assistantId: string;
    chapterTitle: string;
    chapterDescription: string;
    otherChapters: { title: string; description: string }[];
  } = await req.json();

  const { userId } = getAuth(req as unknown as NextApiRequest);

  const aiHandler = getAIEdgeHandler(userId!);
  const threadId = input.threadId;

  if (!threadId) {
    return new Response("threadId is required", { status: 400 });
  }

  const createdMessage = await aiHandler.create.openai_assistantThreadMessage(
    threadId,
    input.message,
  );

  const instruction =
    "Unlocked chapter:" +
    input.chapterTitle +
    ". " +
    input.chapterDescription +
    ". Locked chapters " +
    input.otherChapters.map((c) => c.title).join(", ") +
    ". Never talk about the locked chapters. Only talk about the unlocked chapter. If the user asks about the locked chapters, tell them that you should focus on the current chapter.";

  console.log("instruction", instruction);

  return aiHandler.stream.openai_assistantThread(threadId, createdMessage.id, {
    assistant_id: input.assistantId,
    additional_instructions: instruction,
  });
}
