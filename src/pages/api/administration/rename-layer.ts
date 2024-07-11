import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { renameCourseChatChannel } from "@/src/server/functions/server-chat";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";
import { isValidCuid } from "../../../server/functions/server-input";
import { isAdminModeratorOrEducator } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.id || !data.name) {
      res.status(400).json({ message: "ID, displayName or name not provided" });
      return;
    }

    if (!isValidCuid(data.id)) {
      res.status(400).json({ message: "Invalid layer id" });
      return;
    }

    if (
      !(await isAdminModeratorOrEducator({ userId: userId!, layerId: data.id }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const layer = await prisma.layer.findUnique({
      where: { id: data.id },
    });

    if (!layer) return res.status(404).json({ message: "Layer not found" });

    if (layer.isCourse) {
      await Promise.allSettled([
        prisma.layer.update({
          where: { id: data.id },
          data: {
            name: data.name,
            displayName: data.displayName || "",
            ...(layer.isLinkedCourse
              ? {}
              : {
                  course: {
                    update: {
                      description: data.subtitle || "",
                      name:
                        data.displayName.trim().length > 0
                          ? data.displayName
                          : data.name,
                    },
                  },
                }),
          },
        }),
        layer.isLinkedCourse
          ? Promise.resolve()
          : renameCourseChatChannel(data.id, data.name),
      ]);
    } else {
      await prisma.layer.update({
        where: { id: data.id },
        data: {
          name: data.name,
          displayName: data.displayName || "",
        },
      });
    }

    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      type: "single",
      origin: "api/courses/update-description.ts",
      searchParam: data.id,
    });

    res.status(200).json({ message: "Layer renamed" });
  }
}
