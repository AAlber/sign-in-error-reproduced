import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserData } from "@/src/server/functions/server-user";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";
import { isValidCuid } from "../../../server/functions/server-input";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { data } = JSON.parse(req.body);
      const { id } = data;
      const { userId } = getAuth(req);

      if (!id) {
        res.status(400).json({ message: "No institution id provided" });
        return;
      }

      if (!isValidCuid(id)) {
        res.status(400).json({ message: "Invalid institution id" });
        return;
      }

      const update = await prisma.user.updateMany({
        where: { id: userId! },
        data: {
          currentInstitution: id,
        },
      });

      const newUserData = await getUserData(userId!);
      await cacheHandler.set("user-data", userId!, newUserData);
      await cacheHandler.invalidate.single(
        "user-courses-with-progress-data",
        userId!,
      );

      res.json(newUserData);
    } catch (e: any) {
      Sentry.captureException(e);
      res.status(500).json({ message: e.message });
    }
  }
}
