import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { createInstitutionChatChannel } from "@/src/server/functions/server-chat";
import {
  createAdminRoles,
  getInstitutionById,
} from "@/src/server/functions/server-institutions";
import { sentry } from "@/src/server/singletons/sentry";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { retry } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { institutionId } = JSON.parse(req.body);
      const { userId } = getAuth(req);

      sentry.setUser({ id: userId as string });
      sentry.setContext("api/institutions/complete-institution-onboarding", {
        userId,
        institutionId,
      });

      const [institution, amountOfRoles] = await Promise.all([
        getInstitutionById(institutionId),
        prisma.role.count({
          where: {
            institutionId: institutionId,
          },
        }),
      ]);
      if (!institution) throw new Error("Institution not found");
      if (amountOfRoles === 0) {
        await createAdminRoles(institutionId, userId!);

        if (userId && institutionId && institution.name) {
          await retry(
            () =>
              createInstitutionChatChannel({
                institutionId,
                institutionName: institution?.name,
                adminId: userId,
              }),
            {
              retryIntervalMs: 1000,
            },
          );
        }

        await cacheRedisHandler.invalidate.single(
          "user-courses-with-progress-data",
          userId!,
        );
        await cacheRedisHandler.invalidate.single("user-data", userId!);
        return res.status(200).json("success");
      } else {
        throw new Error(
          "Onboarding was completed already. If this is a mistake please contact support@fuxam.de.",
        );
      }
    } catch (e) {
      sentry.captureException(e);
      return res.status(500).json((e as Error).message);
    }
  }
}
