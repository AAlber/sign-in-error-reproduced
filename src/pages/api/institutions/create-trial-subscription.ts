import { clerkClient, getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import createInstitution from "@/prisma/create-institution";
import { updateCurrentInstitution } from "@/src/server/functions/server-invite";
import type { CreateTrialSubscriptionData } from "@/src/types/server/institution.types";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const { name, language, theme, logo }: CreateTrialSubscriptionData =
        JSON.parse(req.body);

      if (!userId) return res.status(401).json({ message: "Unauthorized" });
      const user = await clerkClient.users.getUser(userId!);
      const email = user?.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      );
      const result = await createInstitution({
        environment:
          process.env.SERVER_URL === "https://fuxam.app" ? "prod" : "dev",
        name,
        language,
        userIdToBeAdmin: userId!,
        theme,
        logo,
        firstAdminEmail: email?.emailAddress as string,
        aiCredits: 100000,
      });
      await updateCurrentInstitution({
        userId,
        institutionId: result.institution.id,
      });

      await cacheRedisHandler.invalidate.single(
        "user-courses-with-progress-data",
        userId!,
      );
      await cacheRedisHandler.invalidate.single("user-data", userId!);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
    }
  }
}
