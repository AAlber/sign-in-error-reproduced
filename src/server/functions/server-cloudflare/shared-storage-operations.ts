import { waitUntil } from "@vercel/functions";
import { reverseMoveFileData } from "@/src/client-functions/client-cloudflare/utils";
import type {
  DeleteMultipleDirectoriesData,
  FileUploadPathData,
  NewMoveFilesData,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { prisma } from "../../db/client";
import { StorageOperations } from "./blob-storage/storage-operations";
import { DBStorageOperations } from "./db-storage/db-storage-operations";
import {
  dealWithFailedDeletion,
  dealWithFailedMovingOperations,
  getInstitutionStorageStatusMismatch,
  getLayerSizesMismatch,
  getStorageCategoriesMismatch,
  listObjectsWithCategoriesMismatch,
} from "./mismatch-logic.ts";
import {
  decodeAndGetKey,
  filterOutFirebaseFiles,
  getValueAfterSegment,
} from "./utils";

export class SharedStorageOperations {
  private dbStorageOperations = new DBStorageOperations();
  private blobStorageOperations = new StorageOperations();

  async listR2Objects(key: string) {
    const institutionId = getValueAfterSegment({
      segment: "institutions",
      url: key,
    });
    if (!institutionId) return undefined;
    const blobStorageObjects =
      await this.blobStorageOperations.listReducedR2Objects(key);
    waitUntil(
      listObjectsWithCategoriesMismatch(key, institutionId, blobStorageObjects),
    );
    return blobStorageObjects;
  }

  async listLayerSizes(institutionId: string) {
    const dbResult =
      await this.dbStorageOperations.getLayerSizes(institutionId);
    log.info("dbResult", dbResult?.length).cli();
    waitUntil(getLayerSizesMismatch(institutionId, dbResult));
    return dbResult;
  }

  getStorageCategories = async (
    data: FileUploadPathData,
    institutionId: string,
  ) => {
    const categories = await this.blobStorageOperations.getStorageCategories(
      data,
      institutionId,
    );
    log.info("storageCategories + dbResult", categories).cli();
    waitUntil(getStorageCategoriesMismatch(data, categories, institutionId));
    return categories;
  };

  async getStorageSize({
    institutionId,
    key,
    subPath,
  }: {
    institutionId?: string;
    key?: string;
    subPath?: string;
  }) {
    if (!key || !institutionId)
      return {
        totalStorageSize: 0,
        subStorageSize: 0,
      };
    const dbResult = await this.dbStorageOperations.getStorageSize(
      institutionId,
      key,
      subPath,
    );
    return dbResult;
  }

  async getInstitutionStorageStatus(institutionId: string) {
    const dbResult =
      await this.dbStorageOperations.getInstitutionStorageStatus(institutionId);
    log.info("StorageStatus-dbResult", dbResult).cli();

    waitUntil(getInstitutionStorageStatusMismatch(institutionId, dbResult));
    return dbResult;
  }

  async deleteFile(key: string) {
    try {
      const [dbResult, storageResult] = await Promise.all([
        this.dbStorageOperations.deleteInstitutionR2Object(key),
        this.blobStorageOperations.deleteFile(key),
      ]);
      log.info("dbResult", dbResult).cli();
      log.info("storageResult", storageResult).cli();
      dealWithFailedDeletion([storageResult]);
      return storageResult;
    } catch (error) {
      waitUntil(this.undoDeleteFile(key));
    }
  }

  deleteFolder = async (url: string) => {
    try {
      const [dbResult, storageResult] = await Promise.all([
        this.dbStorageOperations.deleteR2Folders(url),
        this.blobStorageOperations.deleteFolder(url),
      ]);
      log.info("dbResult", dbResult).cli();
      log.info("storageResult", storageResult).cli();
      waitUntil(
        dealWithFailedDeletion(
          Array.isArray(storageResult) ? storageResult : [storageResult],
        ),
      );
      return storageResult;
    } catch (error) {
      waitUntil(this.undoDeleteFolder(url));
    }
  };

  deleteDirectories = async (data: DeleteMultipleDirectoriesData) => {
    const finalData = filterOutFirebaseFiles(data);
    const results = finalData.map(async (d) => {
      if (d.isFolder) {
        return await this.deleteFolder(d.url);
      } else {
        return await this.deleteFile(d.url);
      }
    });
    return (await Promise.all(results)).flat();
  };

  moveFiles = async (data: NewMoveFilesData[]) => {
    try {
      const [storageResult, dbResult] = await Promise.all([
        this.blobStorageOperations.moveFiles(data),
        this.dbStorageOperations.copyInstitutionR2Objects(data),
      ]);
      log.info("storageResult", storageResult).cli();
      log.info("dbResult", dbResult).cli();
      waitUntil(dealWithFailedMovingOperations(data, storageResult));

      return storageResult;
    } catch (error) {
      const newData = reverseMoveFileData(data);
      waitUntil(this.dbStorageOperations.copyInstitutionR2Objects(newData));
    }
  };

  private undoDeleteFile = async (key: string) => {
    const objects = await this.blobStorageOperations.listReducedR2Objects(key);
    const file = objects.r2Objects[0];
    const institutionId = getValueAfterSegment({
      segment: "institutions",
      url: key,
    });
    log.info("file", file).cli();
    log.info("institutionId", institutionId).cli();

    if (objects && file && institutionId) {
      await prisma.institution.update({
        where: { id: institutionId },
        data: {
          r2Objects: {
            create: {
              key: decodeAndGetKey(key),
              size: file.Size,
              lastModified: file.LastModified,
            },
          },
        },
      });
    }
  };

  private undoDeleteFolder = async (url: string) => {
    const objects = await this.blobStorageOperations.listReducedR2Objects(url);
    const institutionId = getValueAfterSegment({
      segment: "institutions",
      url,
    });
    log.info("institutionId", institutionId).cli();

    objects &&
      institutionId &&
      (await prisma.institution.update({
        where: { id: institutionId },
        data: {
          r2Objects: {
            createMany: {
              data: objects.r2Objects.map((obj) => ({
                key: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified,
              })),
            },
          },
        },
      }));
  };
}

export const sharedStorageOperations = new SharedStorageOperations();
