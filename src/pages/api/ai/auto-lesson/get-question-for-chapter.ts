import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import {
  getContentBlock,
  getContentBlockUserStatusForSpecificUser,
} from "@/src/server/functions/server-content-block";
import { hasAccessToLayer } from "@/src/server/functions/server-role";
import type { GenerateChapterQuestionsResponse } from "@/src/types/ai/ai-request-response.types";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateChapterQuestionsResponse>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { blockId, chapterId } = req.query as {
    blockId: string;
    chapterId: string;
  };
  const { userId } = getAuth(req);

  const block = await getContentBlock(blockId);

  if (!block) {
    return res.status(404).json({ ok: false, message: "Block not found" });
  }

  if (!hasAccessToLayer({ userId: userId!, layerId: block.layerId })) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const aiHandler = await getAIServerHandler(userId!);

  const userStatus =
    await getContentBlockUserStatusForSpecificUser<"AutoLesson">(
      block,
      userId!,
    );

  if (!userStatus.userData) {
    log.info("User has no user data, cannot generate a question.");
    return res.status(401).json({
      ok: false,
      message:
        "No progress in this chapter, so there cannot be a question generated.",
    });
  }

  const chapter = userStatus.userData.chapters.find(
    (c) => c.chapterId === chapterId,
  );

  if (!chapter) {
    log.warn(
      "Chapter not found in user status, setting all chapters locked except the first",
    );
    return res.status(401).json({
      ok: false,
      message:
        "No progress in this chapter, so there cannot be a question generated.",
    });
  }

  if (!chapter.threadId) {
    return res.status(401).json({
      ok: false,
      message:
        "No progress in this chapter, so there cannot be a question generated.",
    });
  }

  const messages = await aiHandler.get.openai_assistantThreadMessages(
    chapter.threadId,
  );

  const blockChapter = (
    block.specs as unknown as ContentBlockSpecsMapping["AutoLesson"]
  ).chapters.find((c) => c.id === chapterId);

  if (!blockChapter) {
    return res.status(404).json({
      ok: false,
      message:
        "Chapter not found in block specs, so there cannot be a question generated",
    });
  }

  const question = await aiHandler.generate.object({
    model: "gpt-3.5-turbo",
    system:
      "You'll be presented with a chat history about the topic '" +
      blockChapter.title +
      "'. The topic has the description: " +
      blockChapter.description +
      ". Based on the chat history, you'll generate a single choice question with multiple answers. The answer has to be in the chat history! If there is no messages related to the topic found, you return enoughContentForQuestion: false and return a random question. Questions should be preferebly not too easy.",
    messages: messages.map((m) => {
      return {
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      };
    }),
    schema: z.object({
      enoughContentForQuestion: z.boolean(),
      question: z.object({
        text: z.string().max(130),
        answers: z.array(
          z.object({
            isCorrect: z.boolean(),
            text: z.string(),
          }),
        ),
      }),
    }),
  });

  if (question.status !== "success") {
    return res
      .status(500)
      .json({ ok: false, message: "Failed to generate question" });
  }

  return res.json({
    ok: true,
    questionData: question.data,
  });
}
