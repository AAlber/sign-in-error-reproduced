import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { copyLayerContentToAnotherLayer } from "@/src/server/functions/server-course";
import type { CopyLayerContentToAnotherLayerArgs } from "@/src/types/server/course.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";
import { isAdminOrModerator } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as CopyLayerContentToAnotherLayerArgs;

    if (!data.layerIdToImportTo)
      return res
        .status(400)
        .json({ message: "No layerToImportFromId provided" });

    if (!data.layerIdToImportFrom)
      return res
        .status(400)
        .json({ message: "No layerToImportFromId provided" });

    const { userId } = getAuth(req);

    const layer = await prisma.layer.findFirst({
      where: { id: data.layerIdToImportFrom },
    });

    if (!layer) {
      res.status(404).json({ message: "Layer not found" });
      return;
    }

    if (
      !(await isAdminOrModerator({
        userId: userId!,
        layerId: data.layerIdToImportFrom,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await copyLayerContentToAnotherLayer(data);

    await cacheHandler.invalidate.single(
      "course-content-blocks",
      data.layerIdToImportTo,
    );

    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      type: "single",
      searchParam: data.layerIdToImportTo,
      origin: "api/courses/import-data-from-course.ts",
    });

    return res
      .status(200)
      .json({ message: "Successfully important content from block" });
  }
}
