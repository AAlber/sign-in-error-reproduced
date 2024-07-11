import { getAuth } from "@clerk/nextjs/server";
import type { InstitutionStripeAccount } from "@prisma/client";
import { waitUntil } from "@vercel/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbStorageOperations } from "@/src/server/functions/server-cloudflare/db-storage/db-storage-operations";
import { createStorageSizePath } from "@/src/server/functions/server-cloudflare/path-generation";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { calculateAndCheckStorageLimits } from "@/src/server/functions/server-cloudflare/storage-limit";
import {
  convertToFuxamStripeSubscription,
  getStorageSubscription,
  getSubscription,
} from "@/src/server/functions/server-stripe";
import { withTryCatch } from "@/src/server/functions/server-utils";
import type { UploadPathDataWithFile } from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uploadData: UploadPathDataWithFile = JSON.parse(req.body as string);
  log.context("cloudflare-upload", uploadData);

  const { storageInfo, institutionId, stripeAccount } =
    await dbStorageOperations.getInstitutionWithStorageSettings(
      userId,
      uploadData.type,
    );

  const uploadKey = storageHandler.create.uploadPath({
    data: uploadData,
    userId,
    institutionId,
  });

  if (!uploadKey) {
    return res.json({ message: "Invalid key" });
  }

  const pathsWhereSizeWillBeChecked = createStorageSizePath({
    data: uploadData,
    institutionId,
    userId,
  });

  if (uploadData.type !== "logo" && !storageInfo) {
    return res.json({ message: "No institution with storage info" });
  }
  const [
    signedUrl,
    authorized,
    storageSizes,
    stripeAccountSubscription,
    storageSubscription,
  ] = await fetchUploadResources({
    uploadKey,
    uploadData,
    institutionId,
    pathsWhereSizeWillBeChecked,
    userId,
    stripeAccount,
  });
  const limitsExceeded = calculateAndCheckStorageLimits({
    sizeAdded: uploadData.size,
    uploadType: uploadData.type,
    storageSizes,
    storageInfo,
    uploadKey,
    res,
    stripeAccountSubscription,
    storageSubscription,
  });
  if (limitsExceeded !== null) return limitsExceeded;
  if (
    !authorizedForUpload({
      uploadData,
      institutionId,
      authorized,
      key: uploadKey,
    })
  ) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(
    limitsExceeded === null && {
      url: signedUrl,
      method: "PUT",
    },
  );
}

async function fetchUploadResources({
  uploadData,
  uploadKey,
  pathsWhereSizeWillBeChecked,
  institutionId,
  stripeAccount,
  userId,
}: {
  uploadKey: string;
  uploadData: UploadPathDataWithFile;
  institutionId: string | undefined;
  pathsWhereSizeWillBeChecked: any;
  stripeAccount?: InstitutionStripeAccount | null;
  userId: string;
}) {
  console.log("stripeAccount", stripeAccount);
  return await Promise.all([
    storageHandler.get.signedPutUrl(uploadKey, {
      ContentType: uploadData.contentType,
      ContentLength: uploadData.size,
    }),
    storageHandler.authorize.write({
      institutionId,
      urls: [uploadKey],
      userId,
    }),
    storageHandler.get.storageSize({
      institutionId,
      key: pathsWhereSizeWillBeChecked?.institutionPath,
      subPath: pathsWhereSizeWillBeChecked?.subPath,
    }),
    stripeAccount
      ? convertToFuxamStripeSubscription(await getSubscription(stripeAccount))
      : null,
    stripeAccount ? getStorageSubscription(stripeAccount) : null,
    dbStorageOperations.createInstitutionR2Objects([
      {
        key: uploadKey,
        size: uploadData.size,
        lastModified: new Date(),
      },
    ]),
  ]);
}

function authorizedForUpload({
  uploadData,
  institutionId,
  authorized,
  key,
}: {
  uploadData: UploadPathDataWithFile;
  institutionId: string | undefined;
  authorized: boolean;
  key: string;
}) {
  if (uploadData.type !== "logo" && (!institutionId || !authorized)) {
    waitUntil(dbStorageOperations.deleteInstitutionR2Object(key));
    log.error("Unauthorized");
    return false;
  }
  return true;
}

export default withTryCatch(handlerLogic);
