import { getAuth } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { getSimpleLayer } from "../../../server/functions/server-administration";
import { isValidUserId } from "../../../server/functions/server-input";
import {
  deleteRole,
  deleteStackedRole,
  hasRoleAssociatedWithLayer,
  isAdminOrModerator,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as DeleteRoleApiArgs;
    const { userId } = getAuth(req);

    if (!isValidUserId(data.userId)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    if (
      !(await isAdminOrModerator({
        userId: userId!,
        layerId: data.layerId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const layer = await getSimpleLayer(data.layerId);
    if (!layer) return res.status(404).json({ message: "Layer not found" });

    if (
      layer.parent_id &&
      layer.parent_id !== layer.institution_id &&
      (await hasRoleAssociatedWithLayer({
        userId: data.userId,
        layerId: layer.parent_id,
      }))
    )
      return res.status(409).json({
        message:
          "Cannot delete role of user that is not associated with parent layer. Please delete the role of the parent layer first.",
      });

    Sentry.captureMessage("Role deletion: " + userId, {
      level: "log",
      extra: {
        userId,
        targetUser: data.userId,
        layerId: data.layerId,
        layer: layer,
      },
    });

    let result: Prisma.BatchPayload;
    if (layer.isCourse) {
      result = await deleteRole(
        data.userId,
        data.layerId,
        layer.institution_id,
      );
    } else {
      result = await deleteStackedRole(
        data.userId,
        data.layerId,
        layer.institution_id,
      );
    }

    await cacheHandler.invalidate.single(
      "user-courses-with-progress-data",
      data.userId,
    );
    res.json(result);
  }
}

export type DeleteRoleApiArgs = {
  userId: string;
  layerId: string;
};
