import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getContentBlock,
  upsertContentBlockUserStatus,
} from "@/src/server/functions/server-content-block";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type {
  ContentBlockUserDataMapping,
  UpdateContentBlockMultipleUserStatusRequest,
} from "@/src/types/content-block/types/user-data.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { log } from "@/src/utils/logger/logger";

export default async function handler<
  T extends keyof ContentBlockUserDataMapping,
>(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  const { blockId, userIds, data } = JSON.parse(
    body,
  ) as UpdateContentBlockMultipleUserStatusRequest<T>;

  log.info("Updating multiple user status", {
    userIds: JSON.stringify(userIds),
    status: data,
  });

  console.log("Updating MULTIPLE USER STATUS", data);

  const { userId: currentUserId } = getAuth(req);
  if (!currentUserId) return res.status(403).json({ success: false });

  const block = await getContentBlock(blockId);
  if (!block) return res.status(404).json("Content block not found");

  const isAuthorized = await isAdminModeratorOrEducator({
    userId: currentUserId,
    layerId: block.layerId,
  });

  if (!isAuthorized) return res.status(401).json({ authorized: false });

  try {
    const roles = userIds.map((userId) => {
      cacheHandler.invalidate.single("user-courses-with-progress-data", userId);
      return upsertContentBlockUserStatus({
        layerId: block.layerId,
        userId,
        blockId,
        updateUserData: false,
        data,
      });
    });

    await Promise.all(roles);
    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, { extra: { blockId, userIds, data } });
    return res.status(500).json({ success: false, error });
  }
}
