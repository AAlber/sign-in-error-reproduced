import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isValidCuid } from "@/src/server/functions/server-input";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

/** gets contentBlocks or a single contentBlock of a layer */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const layerId = req.query.layerId as string;
    const blockId = req.query.blockId as string | undefined;

    if (!isValidCuid(layerId)) {
      res.status(400).json({ message: "Invalid layer id" });
      return;
    }

    const { userId } = getAuth(req);

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const query = !!blockId
      ? prisma.contentBlock.findFirst
      : prisma.contentBlock.findMany;

    let result = await query({
      where: {
        layerId,
        ...(blockId ? { id: blockId } : {}),
      },
    });

    if (Array.isArray(result)) {
      result = result.sort((a, b) => a.position! - b.position!);
    }
    res.json(result);
  }
}
