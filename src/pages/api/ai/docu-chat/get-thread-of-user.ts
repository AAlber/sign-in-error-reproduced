import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import {
  getContentBlock,
  getContentBlockUserStatusForSpecificUser,
} from "@/src/server/functions/server-content-block";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { blockId, userId } = req.query as { blockId: string; userId: string };
  const { userId: currentId } = getAuth(req);

  const block = await getContentBlock(blockId);

  if (!block) {
    return res.status(404).json({ message: "Block not found" });
  }

  if (
    !hasRolesWithAccess({
      userId: currentId!,
      rolesWithAccess: ["admin", "moderator", "educator"],
      layerIds: [block.layerId],
    })
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userStatus = await getContentBlockUserStatusForSpecificUser<"DocuChat">(
    block,
    userId!,
  );

  if (!userStatus.userData) {
    return res.json({ threadId: null, messages: [] });
  }

  const aiHandler = await getAIServerHandler(userId!);
  const messages = await aiHandler.get.openai_assistantThreadMessages(
    userStatus.userData.threadId,
  );

  return res.json({
    threadId: userStatus.userData.threadId,
    messages,
  });
}
