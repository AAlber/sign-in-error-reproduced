import { getAuth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isValidCuid } from "@/src/server/functions/server-input";
import { sendPublishedContentBlockNotification } from "@/src/server/functions/server-notification";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { CreateContentBlock } from "@/src/types/content-block/types/cb-types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as CreateContentBlock;

    const { userId } = getAuth(req);

    if (!data.layerId || !isValidCuid(data.layerId)) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId: data.layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let contentBlocks = await prisma.contentBlock.findMany({
      where: { layerId: data.layerId },
      include: { requirements: true },
    });

    contentBlocks = contentBlocks.sort((a, b) => a.position! - b.position!);

    const count = contentBlocks.length;
    const result = await prisma.contentBlock.create({
      data: {
        ...data,
        position: count,
        startDate: data.startDate,
        dueDate: data.dueDate,
        ...(!!count
          ? { requirements: { connect: { id: contentBlocks[count - 1]?.id } } }
          : {}),
      },
      include: { requirements: true },
    });

    if (data.status === "PUBLISHED") {
      waitUntil(
        sendPublishedContentBlockNotification(
          [data.layerId],
          result.name,
          result.layerId,
        ),
      );
    }

    await cacheHandler.invalidate.single("course-content-blocks", data.layerId);
    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      type: "single",
      searchParam: data.layerId,
      origin: "api/content-block/create.ts",
    });
    return res.json(result);
  }
}
