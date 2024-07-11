import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { UpdateContentBlockRequirements } from "@/src/types/content-block/types/cb-types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

/** connects or disconnect a contentBlock requirement to a specified contentBlockId */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { blockId, requirementId } = JSON.parse(
    req.body,
  ) as UpdateContentBlockRequirements;

  const { userId: uId } = getAuth(req);
  const userId = uId!;

  const block = await prisma.contentBlock.findUniqueOrThrow({
    where: { id: blockId },
    include: { requirements: true },
  });

  if (
    !(await isAdminModeratorOrEducator({
      userId,
      layerId: block.layerId,
    }))
  ) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await prisma.contentBlockRequirements.deleteMany({
    where: { B: blockId },
  });

  if (req.method === "POST") {
    // abort if the blockId is already requiredBy requirementId
    const isLoopRequirement =
      (await prisma.contentBlock.count({
        where: {
          id: blockId,
          requiredBy: {
            some: {
              id: requirementId,
            },
          },
        },
      })) > 0;

    if (isLoopRequirement) {
      res.status(400).json({ success: false, message: "is loop requirement" });
      return;
    }

    await prisma.contentBlock.update({
      where: { id: blockId },
      data: { requirements: { connect: { id: requirementId } } },
    });

    res.json({ success: true });
  } else if (req.method === "DELETE") {
    /**
     * TODO: rename A_B columns
     * A = requirementId, B = blockId
     */

    await prisma.contentBlockRequirements.deleteMany({
      where: { B: blockId },
    });

    await cacheHandler.invalidate.single(
      "course-content-blocks",
      block.layerId,
    );
    res.json({ success: true });
  }
}
