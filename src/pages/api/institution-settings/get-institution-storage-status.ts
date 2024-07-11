import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { getStorageSubscription } from "@/src/server/functions/server-stripe";
import { withTryCatch } from "@/src/server/functions/server-utils";
import { log } from "@/src/utils/logger/logger";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(400).json("Invalid Request");

  const { userId } = getAuth(req);
  if (!userId) return res.status(400).json({ message: "Unauthorized" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      institution: {
        include: {
          stripeAccount: true,
        },
      },
    },
  });
  const stripeAccount = user?.institution?.stripeAccount;
  const institutionId = user?.currentInstitution;
  if (!institutionId || !stripeAccount)
    return res.status(400).json({ message: "Invalid Request" });

  const [authorized, storageStatus, storageSubscription] = await Promise.all([
    await isAdminOfInstitution(userId, institutionId),
    await storageHandler.get.storageStatus(institutionId),
    await getStorageSubscription(stripeAccount),
  ]);
  log.context("Storage status", { storageStatus, storageSubscription }).cli();
  if (!authorized) {
    log.error("Unauthorized").cli();
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({ storageStatus, storageSubscription });
}

export default withTryCatch(handlerLogic);
