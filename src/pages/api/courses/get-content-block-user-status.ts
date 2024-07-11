import { getAuth } from "@clerk/nextjs/server";
import type { UserStatus } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  evaluateContentBlocksStatusFromItsRequirements,
  getContentBlocks,
} from "@/src/server/functions/server-course";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        id: string;
        userStatus: UserStatus | "LOCKED";
      }[]
    | { message: string }
  >,
) {
  try {
    const time = Date.now();
    const layerId = req.query.layerId as string;
    const { userId } = getAuth(req);

    Sentry.setContext("Content Block User Status", {
      userId,
      layerId,
    });

    if (!userId || !layerId)
      return res.status(400).json({ message: "Invalid request" });

    const blocks = await getContentBlocks(layerId);

    const status = await evaluateContentBlocksStatusFromItsRequirements(
      userId,
      blocks,
    );

    const now = Date.now();
    if (now - time < 500) await new Promise((r) => setTimeout(r, 500));

    return res.json(status);
  } catch (e) {
    const err = e as Error;
    Sentry.captureException(err);
    res.status(500).json({ message: err.message });
  }
}
