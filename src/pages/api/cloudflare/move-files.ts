import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { determineDriveTransferType } from "@/src/client-functions/client-cloudflare/utils";
import { prisma } from "@/src/server/db/client";
import { dbStorageOperations } from "@/src/server/functions/server-cloudflare/db-storage/db-storage-operations";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { calculateAndCheckStorageLimits } from "@/src/server/functions/server-cloudflare/storage-limit";
import {
  convertToFuxamStripeSubscription,
  getStorageSubscription,
  getSubscription,
} from "@/src/server/functions/server-stripe";
import { withTryCatch } from "@/src/server/functions/server-utils";
import type { BackendMoveFilesData } from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";

function getFirstFourSections(key: string): string {
  const sections = key.split("/");
  const firstFourSections = sections.slice(0, 4);
  return firstFourSections.join("/");
}

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const data: BackendMoveFilesData = JSON.parse(req.body);
  log.context("Cloudflare move files", data).cli();

  if (req.method !== "POST")
    return res.status(400).json({ message: "Invalid request" });
  const { userId } = getAuth(req);
  if (!userId) return res.status(400).json({ message: "Unauthorized" });
  const { storageInfo, institutionId, stripeAccount } =
    await dbStorageOperations.getInstitutionWithStorageSettings(
      userId,
      "course-drive",
    );
  const transferType = determineDriveTransferType(data.data);

  log.context("transferType", { transferType }).cli();

  const sourceKeys = data.data.map((d) => d.sourceKey);
  const [
    storageSizes,
    r2Objects,
    authorized,
    stripeAccountSubscription,
    storageSubscription,
  ] = await Promise.all([
    storageHandler.get.storageSize({
      institutionId,
      subPath: getFirstFourSections(data.destinationBaseKey),
      key: "institutions/" + institutionId,
    }),
    prisma.institutionR2Object.findMany({
      where: {
        institutionId,
        key: {
          in: sourceKeys,
        },
      },
    }),
    transferType &&
      institutionId &&
      (await storageHandler.authorize.fileTransfer({
        moveFilesData: data,
        transferType,
        userId,
        institutionId,
      })),

    stripeAccount
      ? convertToFuxamStripeSubscription(await getSubscription(stripeAccount))
      : null,
    stripeAccount ? getStorageSubscription(stripeAccount) : null,
  ]);
  function getMoveData(key: string) {
    return data.data.find((d) => d.sourceKey === key);
  }
  const sourceSize = r2Objects
    .map((r2Object) => {
      return getMoveData(r2Object.key)?.deleteSourceKey === true
        ? 0
        : r2Object.size;
    })
    .reduce((acc, size) => acc + size, 0);
  const limitsExceeded = calculateAndCheckStorageLimits({
    sizeAdded: sourceSize,
    uploadType: "course-drive",
    storageSizes,
    storageInfo,
    uploadKey: undefined,
    res,
    storageSubscription,
    stripeAccountSubscription,
  });
  if (limitsExceeded !== null) return limitsExceeded;
  if (transferType === "base-path-mismatch") {
    return res.status(400).json({ message: "Invalid request" });
  }
  if (!authorized) {
    log.error("Unauthorized").cli();
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json(
    limitsExceeded === null && (await storageHandler.copy.files(data.data)),
  );
}

export default withTryCatch(handlerLogic);
