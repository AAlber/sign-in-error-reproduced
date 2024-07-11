import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { createUpdateUserToken } from "@/src/server/functions/server-mobile-notification";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
    if (req.method === "POST") {
      const data = JSON.parse(req.body);
      const { userId } = getAuth(req);

      if (!userId)
        return res.status(401).json({ message: "Unauthorized: No user id" });

      if (!data.token)
        return res
          .status(400)
          .json({ message: "Bad Request: No token provided" });

      if (!data.language)
        return res
          .status(400)
          .json({ message: "Bad Request: No language specified" });

      const pushToken = await prisma.userNotificationPushToken.findUnique({
        where: {
          userId,
        },
      });

      Sentry.addBreadcrumb({
        message: "Querying push token",
        data: { pushToken },
      });

      await createUpdateUserToken(userId, data.token, data.language);
    }
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
