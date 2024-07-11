import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { contentBlocks, layerId } = JSON.parse(
      req.body,
    ) as ReorderContentBlockPositionArgs;

    const { userId } = getAuth(req);
    if (!userId) return res.status(403).json({ success: false });

    const isAuthorized = await isAdminModeratorOrEducator({ userId, layerId });
    if (!isAuthorized) return res.status(403).json({ success: false });

    const result = await prisma.$transaction(
      async (tx) => {
        const cbIds = contentBlocks.map((i) => i.id);
        // basically remove all requirements
        await tx.contentBlockRequirements.deleteMany({
          where: { OR: [{ A: { in: cbIds }, B: { in: cbIds } }] },
        });

        const promises = contentBlocks.map(
          async ({ id, position, requirements }) => {
            return await tx.contentBlock.update({
              where: { id, layerId },
              data: {
                position,
                ...(requirements?.length
                  ? {
                      requirements: { connect: { id: requirements[0] } },
                    }
                  : {}),
              },
            });
          },
        );

        return await Promise.all(promises);
      },
      {
        timeout: 15000,
      },
    );

    await cacheHandler.invalidate.single("course-content-blocks", layerId);

    res.json(result);
  }
}

export type ReorderContentBlockPositionArgs = {
  /** The position number will come from frontend,
   * as user arranges contentBlocks inside the course page */
  contentBlocks: {
    id: string;
    position: number;
    requirements?: string[];
  }[];
  layerId: string;
};
