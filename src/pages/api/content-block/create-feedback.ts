import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasAccessToLayer } from "@/src/server/functions/server-role";
import type { CreateContentBlockFeedback } from "@/src/types/content-block/types/cb-types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

/** creates or updates an existing feedback for a contentBlock */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body;
  const auth = getAuth(req);

  /** userId here is the one creating or updating the feedback */
  const { userId } = auth;
  if (!userId) return res.status(403).json("UNAUTHORIZED");

  const { layerId, ...data } = JSON.parse(body) as CreateContentBlockFeedback;

  const isAuthorized = hasAccessToLayer({ userId, layerId });
  if (!isAuthorized) return res.status(403).json("UNAUTHORIZED");

  const result = await prisma.$transaction(async (tx) => {
    const exists = await tx.contentBlockFeedback.findFirst({
      where: { userId, blockId: data.blockId },
    });

    return exists
      ? await tx.contentBlockFeedback.update({
          data: { ...data, updatedAt: new Date() },
          where: { id: exists.id },
        })
      : await tx.contentBlockFeedback.create({
          data: { ...data, userId },
        });
  });

  await cacheHandler.invalidate.single("course-content-blocks", layerId);
  res.json(result);
}
