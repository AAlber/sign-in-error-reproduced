import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSimpleLayer } from "@/src/server/functions/server-administration";
import {
  getContentBlocks,
  getContentBlocksWithFeedback,
} from "@/src/server/functions/server-course";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import type { ContentBlock } from "@/src/types/course.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ contentBlocks: ContentBlock[] } | { message: string }>,
) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: "No authorization token" });
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      return res.status(401).send({ message: "Invalid authorization token" });
    }

    const layerId = req.query.layerId as string;

    const layer = await getSimpleLayer(layerId);
    const settings = await getInstitutionSettings(layer?.institution_id ?? "");
    const showContentBlockFeedbacks = !!settings?.feedback_content_blocks;

    Sentry.addBreadcrumb({ message: "Fetching course data" });
    const contentBlocks = await (showContentBlockFeedbacks
      ? getContentBlocksWithFeedback(layerId)
      : getContentBlocks(layerId));

    Sentry.addBreadcrumb({ message: "Evaluating content block status" });

    Sentry.addBreadcrumb({ message: "Sorting content blocks" });

    const sortedContentBlocks = contentBlocks.sort(
      (a, b) => Number(a.position) - Number(b.position),
    );

    await cacheHandler.set("course-content-blocks", layerId, {
      contentBlocks: sortedContentBlocks,
    });

    Sentry.addBreadcrumb({ message: "Setting course data in cache" });
    return res.json({ contentBlocks: sortedContentBlocks });
  } catch (e) {
    const err = e as Error;
    Sentry.captureException(err);
    res.status(500).json({ message: err.message });
  }
}
