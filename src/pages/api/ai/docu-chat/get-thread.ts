import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import {
  getContentBlock,
  getContentBlockUserStatusForSpecificUser,
  upsertContentBlockUserStatus,
} from "@/src/server/functions/server-content-block";
import { hasAccessToLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { blockId } = req.query as { blockId: string };
  const { userId } = getAuth(req);

  const block = await getContentBlock(blockId);

  if (!block) {
    return res.status(404).json({ message: "Block not found" });
  }

  if (!hasAccessToLayer({ userId: userId!, layerId: block.layerId })) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const aiHandler = await getAIServerHandler(userId!);

  const userStatus = await getContentBlockUserStatusForSpecificUser<"DocuChat">(
    block,
    userId!,
  );

  if (!userStatus.userData) {
    const thread = await aiHandler.create.openai_assistantThread();
    await upsertContentBlockUserStatus<"DocuChat">({
      blockId: block.id,
      layerId: block.layerId,
      userId: userId!,
      data: {
        userData: {
          threadId: thread.id,
          messageCount: 0,
        },
      },
    });
    return res.json({ threadId: thread.id, messages: [] });
  }

  const messages = await aiHandler.get.openai_assistantThreadMessages(
    userStatus.userData.threadId,
  );

  return res.json({
    threadId: userStatus.userData.threadId,
    messages,
  });
}
