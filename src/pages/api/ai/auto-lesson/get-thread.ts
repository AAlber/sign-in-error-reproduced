import { getAuth } from "@clerk/nextjs/server";
import type { ContentBlock } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Thread } from "openai/resources/beta/threads/threads";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import {
  getContentBlock,
  getContentBlockUserStatusForSpecificUser,
  upsertContentBlockUserStatus,
} from "@/src/server/functions/server-content-block";
import { hasAccessToLayer } from "@/src/server/functions/server-role";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { blockId, chapterId } = req.query as {
    blockId: string;
    chapterId: string;
  };
  const { userId } = getAuth(req);

  const block = await getContentBlock(blockId);

  if (!block) {
    return res.status(404).json({ message: "Block not found" });
  }

  if (!hasAccessToLayer({ userId: userId!, layerId: block.layerId })) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const aiHandler = await getAIServerHandler(userId!);

  const userStatus =
    await getContentBlockUserStatusForSpecificUser<"AutoLesson">(
      block,
      userId!,
    );

  if (!userStatus.userData) {
    log.info(
      "User has no user data, setting all chapters locked except the first",
    );
    const thread = await aiHandler.create.openai_assistantThread();
    await setAllChaptersLockedExceptTheFirst(block, userId!, thread);
    return res.json({ threadId: thread.id, messages: [] });
  }

  const chapter = userStatus.userData.chapters.find(
    (c) => c.chapterId === chapterId,
  );

  if (!chapter) {
    log.warn(
      "Chapter not found in user status, setting all chapters locked except the first",
    );
    const thread = await aiHandler.create.openai_assistantThread();
    await setAllChaptersLockedExceptTheFirst(block, userId!, thread);
    return res.json({ threadId: thread.id, messages: [] });
  }

  if (!chapter.threadId) {
    log.info("Chapter has no threadId, creating a new thread");
    const thread = await aiHandler.create.openai_assistantThread();
    await upsertContentBlockUserStatus<"AutoLesson">({
      blockId: block.id,
      layerId: block.layerId,
      userId: userId!,
      data: {
        userData: {
          chapters: userStatus.userData.chapters.map((c) => {
            if (c.chapterId === chapterId) {
              return {
                chapterId: c.chapterId,
                unlocked: true,
                finished: false,
                threadId: thread.id,
              };
            } else {
              return c;
            }
          }),
        },
      },
    });
    return res.json({ threadId: thread.id, messages: [] });
  }

  const messages = await aiHandler.get.openai_assistantThreadMessages(
    chapter.threadId,
  );

  return res.json({
    threadId: chapter.threadId,
    messages,
  });
}

async function setAllChaptersLockedExceptTheFirst(
  block: ContentBlock,
  userId: string,
  thread: Thread,
) {
  await upsertContentBlockUserStatus<"AutoLesson">({
    blockId: block.id,
    layerId: block.layerId,
    userId: userId!,
    data: {
      userData: {
        chapters: (
          block.specs as unknown as ContentBlockSpecsMapping["AutoLesson"]
        ).chapters.map((c, index) => {
          if (index === 0) {
            return {
              chapterId: c.id,
              finished: false,
              unlocked: true,
              threadId: thread.id,
            };
          } else {
            return {
              chapterId: c.id,
              finished: false,
              unlocked: false,
              threadId: "",
            };
          }
        }),
      },
    },
  });
}
