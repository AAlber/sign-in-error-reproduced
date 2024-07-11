import { getAuth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isValidCuid } from "@/src/server/functions/server-input";
import { sendPublishedContentBlockNotification } from "@/src/server/functions/server-notification";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { UpdateContentBlock } from "@/src/types/content-block/types/cb-types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body) as UpdateContentBlock;
    const { userId } = getAuth(req);

    if (!body.id || !isValidCuid(body.id as string)) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    /**
     * make sure we remove the keys we do not want
     * to accidentally update
     */
    const {
      id,
      type: _type,
      requirements: _requirements,
      layerId: _layerId,
      ...data
    } = body;

    const { layerId } = await prisma.contentBlock.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    /**
     * TODO:
     * - validate contentBLock
     * - validate metadata of contentBlock with respect to type
     */

    const result = await prisma.contentBlock.update({
      where: { id },
      data,
    });

    if (data.status === "PUBLISHED") {
      waitUntil(
        sendPublishedContentBlockNotification(
          [layerId],
          result.name,
          result.layerId,
        ),
      );
    }

    await cacheHandler.invalidate.single("course-content-blocks", layerId);
    res.json(result);
  }
}
