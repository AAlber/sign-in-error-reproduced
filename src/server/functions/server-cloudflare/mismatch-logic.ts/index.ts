import cuid from "cuid";
import { dealWithStorageLimitErrors } from "@/src/client-functions/client-cloudflare/uppy-logic";
import {
  isLimitReachedError,
  reverseMoveFileData,
} from "@/src/client-functions/client-cloudflare/utils";
import { prisma } from "@/src/server/db/client";
import type {
  DeletionResult,
  FileUploadPathData,
  LimitReachedError,
  ListDirectoryReturnData,
  MoveFilesResult,
  NewMoveFilesData,
  StorageCategory,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import { storageOperations } from "../blob-storage/storage-operations";
import { dbStorageOperations } from "../db-storage/db-storage-operations";
import {
  compareLayerSizes,
  compareReducedR2Objects,
  compareStorageCategories,
} from "./deep-comparisons";

// Helper function to log mismatches and sync storage
async function handleMismatch(
  mismatchCheck,
  description: string,
  institutionId: string,
) {
  if (
    mismatchCheck?.mismatchingObjectsFirst.length > 0 ||
    mismatchCheck.mismatchingObjectsSecond.length > 0
  ) {
    log.info(`Mismatch in ${description}`, mismatchCheck).cli();
    log.error(`Mismatch in ${description}`).cli();
    await syncInstitutionWithStorage(institutionId);
  }
}

// Function to list and handle category mismatches
export async function listObjectsWithCategoriesMismatch(
  key: string,
  institutionId: string,
  blobStorageResult: ListDirectoryReturnData,
) {
  const dbResult = await dbStorageOperations.listObjectsWithCategories(key);
  const filteredDbResult = dbResult.r2Objects.filter((obj) =>
    obj.Key.startsWith(key),
  );
  log.info("Results", { filteredDbResult, blobStorageResult });

  await handleMismatch(
    compareReducedR2Objects(filteredDbResult, blobStorageResult.r2Objects),
    "storage objects",
    institutionId,
  );
}

// Function to sync institution storage details
export async function syncInstitutionWithStorage(institutionId: string) {
  log.info("Syncing institution with storage", institutionId);
  const blobObjects = await storageOperations.listR2Objects(
    `institutions/${institutionId}`,
  );
  log.info("Blob objects", blobObjects?.length);
  const updatedR2Objects = blobObjects
    ?.map((obj) => ({
      key: obj.Key || `institutions/${institutionId}/random-unfound/${cuid()}`,
      size: obj.Size || 0,
      lastModified: obj.LastModified || new Date(),
    }))
    .filter(filterUndefined);

  log.error("Mismatch pre update", JSON.stringify(updatedR2Objects));
  if (updatedR2Objects?.length && updatedR2Objects) {
    log.info("Updated R2 objects", updatedR2Objects.length);
    await prisma.institutionR2Object.deleteMany({ where: { institutionId } });

    log.info("Updated R2 objects 2", updatedR2Objects.length);
    await prisma.institution.update({
      where: { id: institutionId },
      data: { r2Objects: { create: updatedR2Objects } },
      include: { r2Objects: true },
    });

    log.error("Mismatch post update", updatedR2Objects.length.toString()).cli();
  }
}

// Function to handle layer size mismatches
export async function getLayerSizesMismatch(
  institutionId: string,
  dbResult?: { layerId: string | null | undefined; size: number }[],
) {
  const storageResult =
    await storageOperations.getInstitutionStorageOverview(institutionId);
  await handleMismatch(
    compareLayerSizes(dbResult, storageResult),
    "layer sizes",
    institutionId,
  );
}

// Function to handle layer size mismatches
export async function getStorageCategoriesMismatch(
  data: FileUploadPathData,
  dbResult: StorageCategory[],
  institutionId: string,
) {
  const storageResult = await storageOperations.getStorageCategories(
    data,
    institutionId,
  );
  await handleMismatch(
    compareStorageCategories(dbResult, storageResult),
    "storage categories",
    institutionId,
  );
}

// Function to check institution storage status mismatches
export async function getInstitutionStorageStatusMismatch(
  institutionId: string,
  dbResult: {
    totalSize: number;
    courseDrivesSize: number;
    userDrivesSize: number;
  },
) {
  const storageResult =
    await storageOperations.getInstitutionStorageStatus(institutionId);
  if (
    dbResult.totalSize !== storageResult.totalSize ||
    dbResult.courseDrivesSize !== storageResult.courseDrivesSize ||
    dbResult.userDrivesSize !== storageResult.userDrivesSize
  ) {
    log
      .error(
        "Mismatch in storage status",
        JSON.stringify({ dbResult, storageResult }),
      )
      .cli();
    await syncInstitutionWithStorage(institutionId);
  }
}

export async function dealWithFailedMovingOperations(
  data: NewMoveFilesData[],
  storageResult: MoveFilesResult[] | LimitReachedError,
) {
  const failedOperations: (NewMoveFilesData | undefined)[] = [];
  if (isLimitReachedError(storageResult)) {
    return dealWithStorageLimitErrors(storageResult);
  }
  storageResult.forEach((result) => {
    if (!result.result) {
      log.error("Failed moving operation", JSON.stringify(result)).cli();
    }
    if (result.result.$metadata.httpStatusCode !== 200) {
      const failedOperationData = data.find(
        (d) =>
          d.destinationKey === result.destinationKey &&
          d.sourceKey === result.sourceKey,
      );
      failedOperations.push(failedOperationData);
    }
  });
  if (failedOperations.length > 0) {
    log
      .error("Failed moving operations", JSON.stringify(failedOperations))
      .cli();

    const newMoveFilesData = reverseMoveFileData(
      failedOperations.filter(filterUndefined),
    );
    await dbStorageOperations.copyInstitutionR2Objects(newMoveFilesData);
  }
}

export async function dealWithFailedDeletion(storageResult: DeletionResult[]) {
  const failedResults: DeletionResult[] = [];
  storageResult.forEach((result) => {
    if (result.statusCode !== 204) {
      log.error("Failed deletion operation", JSON.stringify(result)).cli();
      failedResults.push(result);
    }
  });
  if (failedResults.length > 0) {
    log
      .error("Failed deletion operations", JSON.stringify(failedResults))
      .cli();
  }
  // now get all the objects with those keys and add them back to the db
  const finalObjects = (
    await Promise.all(
      failedResults.map(async (result) => {
        if (!result.key) return undefined;
        const objects = await storageOperations.listReducedR2Objects(
          result.key,
        );
        const file = objects.r2Objects[0];
        if (file) {
          return {
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
          };
        }
      }),
    )
  ).filter(filterUndefined);
  await dbStorageOperations.createInstitutionR2Objects(finalObjects);
}
