import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getContentBlock,
  getContentBlockUserStatus,
} from "@/src/server/functions/server-content-block";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type {
  ContentBlockSpecsMapping,
  HandInSpecs,
} from "@/src/types/content-block/types/specs.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { blockId, includeUserData } = req.query as {
      blockId: string;
      includeUserData: string;
    };

    if (!blockId) return res.status(400).json("No block id provided");

    const { userId } = getAuth(req);
    if (!userId) return res.status(403).json({ success: false });

    const block = await getContentBlock(blockId);
    if (!block) return res.status(404).json("Content block not found");
    const isHandIn =
      (block.type as keyof ContentBlockSpecsMapping) === "HandIn";
    const isSharedSubmission =
      isHandIn && (block.specs as unknown as HandInSpecs).isSharedSubmission;

    const isGroupSubmission =
      isHandIn && (block.specs as unknown as HandInSpecs).isGroupSubmission;

    const isAuthorized = await isAdminModeratorOrEducator({
      userId,
      layerId: block.layerId,
    });
    if (!isAuthorized && !isSharedSubmission && !isGroupSubmission)
      return res.status(401).json({ authorized: false });

    const result = await getContentBlockUserStatus(
      block,
      includeUserData === "true",
    );
    res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
