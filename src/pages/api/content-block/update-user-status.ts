import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { waitUntil } from "@vercel/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getContentBlock,
  upsertContentBlockUserStatus,
} from "@/src/server/functions/server-content-block";
import { sendHandInGroupWorkSelectionNotification } from "@/src/server/functions/server-notification";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type {
  ContentBlockUserDataMapping,
  UpdateContentBlockUserStatusRequest,
} from "@/src/types/content-block/types/user-data.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

// the student will be updating this handler
export default async function handler<
  T extends keyof ContentBlockUserDataMapping,
>(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  const { blockId, userId, data } = JSON.parse(
    body,
  ) as UpdateContentBlockUserStatusRequest<T>;

  const { userId: currentUserId } = getAuth(req);
  if (!currentUserId) return res.status(403).json({ success: false });

  const block = await getContentBlock(blockId);
  if (!block) return res.status(404).json("Content block not found");

  const isAuthorized = !userId
    ? true
    : (await isAdminModeratorOrEducator({
        userId: currentUserId,
        layerId: block.layerId,
      })) || currentUserId === userId;

  if (!isAuthorized) return res.status(401).json({ authorized: false });

  try {
    await upsertContentBlockUserStatus({
      blockId: block.id,
      data,
      layerId: block.layerId,
      userId: userId || currentUserId,
    });

    if (
      data.status === "FINISHED" &&
      data.userData &&
      typeof data.userData === "object" &&
      "peerUserId" in data.userData
    ) {
      const handedInWorkOfPeer =
        !!data.userData.peerUserId && !!data.userData.uploadedByPeer;

      if (handedInWorkOfPeer) {
        // Sends notification to that peer user
        waitUntil(
          sendHandInGroupWorkSelectionNotification(
            block.name,
            block.layerId,
            data.userData!.peerUserId as string,
            currentUserId,
          ),
        );
      }
    }

    await cacheHandler.invalidate.single(
      "user-courses-with-progress-data",
      userId || currentUserId,
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, { extra: { blockId, userId, data } });
    return res.status(500).json({ success: false, error });
  }
}
