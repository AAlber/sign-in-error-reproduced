import { waitUntil } from "@vercel/functions";
import type { NextApiResponse } from "next";
import type {
  InstitutionWithStorageLimits,
  UploadPathType,
  UploadStorageSizes,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import { BYTES_IN_1GB, BYTES_IN_1MB, getTotalStorage } from "@/src/utils/utils";
import { dbStorageOperations } from "./db-storage/db-storage-operations";
import { isCourseUpload, isPublicUpload } from "./path-generation";

interface CheckStorageLimitData {
  sizeAdded: number;
  uploadType: UploadPathType;
  storageSizes: UploadStorageSizes;
  storageInfo: InstitutionWithStorageLimits | undefined;
  uploadKey?: string;
  res: NextApiResponse;
  storageSubscription: FuxamStripeSubscription | null;
  stripeAccountSubscription: FuxamStripeSubscription | null;
}

export const calculateAndCheckStorageLimits = (
  params: CheckStorageLimitData,
) => {
  const { totalStorageSize, subStorageSize } = params.storageSizes;
  const newDriveSize = (subStorageSize || 0) + params.sizeAdded;
  const newInstitutionStorageSize = totalStorageSize + params.sizeAdded;
  const isTestInstitution =
    params.stripeAccountSubscription?.isTestInstitution === true;
  if (params.uploadType === "logo") {
    if (params.sizeAdded > 4 * BYTES_IN_1MB) {
      return params.res.status(400).json({
        message: "file_too_large",
        limit: 4 + "MB",
      });
    }
    return null;
  }
  if (!params.storageInfo) throw new Error("No storage info found");
  if (!params.stripeAccountSubscription)
    throw new Error("No stripe account found");
  const { baseGB, gbPerUser } = params.storageInfo;

  const organizationLimit = getTotalStorage({
    isTestInstitution,
    baseStorageGb: baseGB,
    gbPerUser,
    subscription: params.stripeAccountSubscription,
    storageSubscription: params.storageSubscription,
  });

  return checkStorageLimits({
    ...params,
    newDriveSize,
    newInstitutionStorageSize,
    organizationLimit,
  });
};

function checkStorageLimits(
  params: CheckStorageLimitData & {
    newDriveSize: number;
    newInstitutionStorageSize: number;
    organizationLimit: number;
  },
) {
  const {
    uploadType,
    storageInfo,
    newDriveSize,
    organizationLimit,
    newInstitutionStorageSize,
    res,
    uploadKey,
  } = params;
  if (!storageInfo) throw new Error("No storage info found");
  const courseLimit = storageInfo.courseLimit * BYTES_IN_1GB;
  const userLimit = storageInfo.userLimit * BYTES_IN_1GB;

  if (isCourseUpload(uploadType) && newDriveSize >= (courseLimit || 0)) {
    logErrorAndDelete(
      "course-limit-reached",
      storageInfo?.courseLimit + "GB",
      uploadKey,
    );
    return res.status(400).json({
      message: "course-limit-reached",
      limit: storageInfo?.courseLimit + "GB",
    });
  }

  if (uploadType === "user-drive" && newDriveSize >= (userLimit || 0)) {
    logErrorAndDelete(
      "user-limit-reached",
      storageInfo?.userLimit + "GB",
      uploadKey,
    );
    return res.status(400).json({
      message: "user-limit-reached",
      limit: storageInfo?.userLimit + "GB",
    });
  }

  if (
    !isPublicUpload(uploadType) &&
    newInstitutionStorageSize >= organizationLimit * BYTES_IN_1GB
  ) {
    logErrorAndDelete(
      "organization-limit-reached",
      organizationLimit + "GB",
      uploadKey,
    );
    return res.status(400).json({
      message: "organization-limit-reached",
      limit: organizationLimit + "GB",
    });
  }

  return null;
}

function logErrorAndDelete(message: string, limit: string, uploadKey?: string) {
  log.error(message);
  if (uploadKey) {
    waitUntil(dbStorageOperations.deleteInstitutionR2Object(uploadKey));
  }
}
