import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getContentBlock,
  getContentBlockUserStatusForSpecificUser,
} from "@/src/server/functions/server-content-block";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { GetContentBlockUserOfUserStatusRequest } from "@/src/types/content-block/types/user-data.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { blockId, userId: requestedUserId } =
      req.query as unknown as GetContentBlockUserOfUserStatusRequest;

    if (!blockId) return res.status(400).json("No block id provided");

    const { userId } = getAuth(req);
    if (!userId) return res.status(403).json({ success: false });

    const block = await getContentBlock(blockId);
    if (!block) return res.status(404).json("Content block not found");

    const isHigherRole = await isAdminModeratorOrEducator({
      userId,
      layerId: block.layerId,
    });

    const isAuthorized = !requestedUserId
      ? true
      : isHigherRole || userId === requestedUserId;
    if (!isAuthorized) return res.status(401).json({ authorized: false });

    const result = await getContentBlockUserStatusForSpecificUser(
      block,
      requestedUserId || userId,
    );

    const dontReturnGrades =
      result.status !== "REVIEWED" &&
      result.rating &&
      result.rating.id &&
      !isHigherRole;

    if (dontReturnGrades) {
      // If not a higher role
      // and status is not "REVIEWED" but already have grades,
      // dont return the grades yet since
      // it's not yet a "Published" / "Shared" grades
      delete result.rating;
    }
    res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
