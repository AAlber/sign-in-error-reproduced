import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getSimpleLayer } from "@/src/server/functions/server-administration";
import { getContentBlock } from "@/src/server/functions/server-content-block";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { UpsertUserGrading } from "@/src/types/content-block/types/cb-types";

/** update or create user grading requirements for a course/layerId */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as UpsertUserGrading;

    const { userId } = getAuth(req);
    if (!userId) return res.status(403).json({ success: false });

    const block = await getContentBlock(data.blockId);
    if (!block) return res.status(404).json("Content block not found");

    const isAuthorized = await isAdminModeratorOrEducator({
      userId,
      layerId: block.layerId,
    });
    if (!isAuthorized) return res.status(401).json({ authorized: false });

    const layerId = block.layerId;
    const layer = await getSimpleLayer(block.layerId);
    const institutionId = layer?.institution_id as string;

    const { id: gradingId, ...input } = data;

    const result =
      "id" in data
        ? await prisma.contentBlockUserGrading.update({
            where: { id: gradingId },
            data: { ...input, graderUserId: userId },
          })
        : await prisma.contentBlockUserGrading.create({
            data: {
              ...input,
              institutionId,
              layerId,
              graderUserId: userId,
            },
          });

    res.json(result);
  }
}
