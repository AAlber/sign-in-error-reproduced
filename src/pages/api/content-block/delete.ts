import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isValidCuid } from "@/src/server/functions/server-input";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const data = JSON.parse(req.body) as { blockId: string };

    const { userId } = getAuth(req);

    if (!data.blockId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const blockId = data.blockId;

    if (!isValidCuid(blockId)) {
      res.status(400).json({ message: "Invalid block or layer id" });
      return;
    }
    const block = await prisma.contentBlock.findUniqueOrThrow({
      where: { id: blockId },
    });

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId: block.layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await prisma.contentBlock.delete({
      where: {
        id: blockId,
      },
    });

    // remove records from this table as well
    await prisma.contentBlockRequirements.deleteMany({
      where: { OR: [{ A: blockId }, { B: blockId }] },
    });

    await cacheHandler.invalidate.single(
      "course-content-blocks",
      block.layerId,
    );
    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      type: "single",
      origin: "api/content-block/delete.ts",
      searchParam: block.layerId,
    });
    return res.json({ success: true });
  }
}
