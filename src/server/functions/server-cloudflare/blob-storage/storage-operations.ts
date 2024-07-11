import type {
  _Object,
  ListObjectsV2Output,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getBasicDirectoryInfo,
  getStringBeforeLastSlash,
} from "@/src/client-functions/client-cloudflare/utils";
import type {
  DeleteMultipleDirectoriesData,
  FileUploadPathData,
  ListDirectoryReturnData,
  NewMoveFilesData,
  StorageCategory,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import { R2 } from "../../../singletons/s3";
import {
  aggregateSizes,
  convertCloudflareObjectToReducedObject,
  filterOutFirebaseFiles,
  getValueAfterSegment,
} from "../utils";
import { S3Commands } from "./s3-commands";

export class StorageOperations {
  private s3Commands = new S3Commands();

  async getFile(key: string) {
    const getRequest = this.s3Commands.get(key);
    return await R2.send(getRequest);
  }
  async listR2Objects(prefix: string) {
    let continuationToken;
    const allObjects: ListObjectsV2Output["Contents"] = [];

    do {
      const listRequest = this.s3Commands.list(prefix, continuationToken);
      const result = await R2.send(listRequest);
      if (!result) return;
      allObjects.push(...(result.Contents ?? []));
      continuationToken = result.NextContinuationToken;
    } while (continuationToken);

    return allObjects;
  }

  async getStorageSize(key: string, subPath?: string) {
    const objects = await this.listR2Objects(key);
    if (!objects) return 0;
    const totalStorageSize = objects.reduce(
      (acc, curr) => acc + (curr.Size ?? 0),
      0,
    );
    if (subPath) {
      const filteredObjects = objects.filter(
        (obj) => obj.Key?.includes(subPath),
      );
      return {
        totalStorageSize,
        subStorageSize: filteredObjects.reduce(
          (acc, curr) => acc + (curr.Size ?? 0),
          0,
        ),
      };
    }
    return { totalStorageSize, subStorageSize: undefined };
  }

  async getStorageCategories(data: FileUploadPathData, institutionId?: string) {
    const defaultResult = [
      {
        title: "course-drive",
        size: 0,
      },
      {
        title: "content_block_files",
        size: 0,
      },
    ];
    switch (data.type) {
      case "course-drive":
        const key = `institutions/${institutionId}/layer/${data.layerId}`;
        const objects = await this.listR2Objects(key);
        if (!objects) return defaultResult;
        const totalSize = objects.reduce(
          (acc, curr) => acc + (curr.Size || 0),
          0,
        );
        const courseDriveObjects = objects.filter(
          (obj) => obj.Key?.includes(key + "/course-drive"),
        );
        const courseDrivesSize = courseDriveObjects.reduce(
          (acc, curr) => acc + (curr.Size || 0),
          0,
        );
        const contentBlockSize = totalSize - courseDrivesSize;
        const returnData: StorageCategory[] = [
          {
            title: "course-drive",
            size: courseDrivesSize,
          },
          {
            title: "content_block_files",
            size: contentBlockSize,
          },
        ].filter(filterUndefined) as StorageCategory[];
        return returnData;
      default:
        return defaultResult;
    }
  }

  async listReducedR2Objects(key: string) {
    // let truncated = false;
    const promises: Promise<_Object[] | StorageCategory | undefined>[] = [
      this.listR2Objects(key),
    ];
    if (key.split("/").pop() === "course-drive") {
      promises.push(this.getContentBlockFolder(key));
    }
    const [objects, contentBlockFolder] = await Promise.all(promises);
    const finalObjects = convertCloudflareObjectToReducedObject(
      objects as _Object[] | undefined,
    );

    const returnData: ListDirectoryReturnData = {
      r2Objects: finalObjects,
      storageCategories: [
        {
          title: "course-drive",
          size: finalObjects.reduce((acc, curr) => acc + curr.Size, 0),
        },
        contentBlockFolder,
      ].filter(filterUndefined) as StorageCategory[],
    };

    log.info("Objects listed", finalObjects).cli();
    log.info("Content block folder", contentBlockFolder).cli();
    return returnData;
  }

  async getInstitutionStorageOverview(institutionId: string) {
    try {
      const key = `institutions/${institutionId}/layer`;

      const objects = await this.listR2Objects(key);
      if (!objects) return [];
      const data = objects.map((obj) => {
        const layerId = getValueAfterSegment({
          segment: "layer",
          url: obj.Key!,
        });
        return {
          layerId,
          size: obj.Size || 0,
        };
      });

      return aggregateSizes(data);
    } catch (error) {
      log
        .error("Error in getInstitutionStorageStatus", (error as Error).message)
        .cli();
      return undefined;
    }
  }

  async getInstitutionStorageStatus(institutionId: string) {
    const objects = await this.listR2Objects(`institutions/${institutionId}`);
    let totalSize = 0,
      courseDrivesSize = 0,
      userDrivesSize = 0;

    if (!objects) return { totalSize, courseDrivesSize, userDrivesSize };
    objects.forEach((obj) => {
      const determinant = obj.Key?.split("/")[2];
      if (determinant === "user") {
        userDrivesSize += obj.Size || 0;
      } else if (determinant === "layer") {
        courseDrivesSize += obj.Size || 0;
      }
      totalSize += obj.Size || 0;
    });

    return { totalSize, courseDrivesSize, userDrivesSize };
  }

  async getFileSignedUrl(key: string) {
    return await getSignedUrl(R2, this.s3Commands.get(key), {
      expiresIn: 3600,
    });
  }

  async putFileSignedUrl(
    key: string,
    data?: Omit<PutObjectCommandInput, "Bucket" | "Key">,
  ) {
    return await getSignedUrl(R2, this.s3Commands.put(key, data), {
      expiresIn: 3600,
    });
  }

  async deleteFile(key: string) {
    const deleteRequest = this.s3Commands.delete(key);
    const result = await R2.send(deleteRequest);
    if (result.$metadata.httpStatusCode !== 204) {
      throw new Error(`Failed to delete file ${key}`);
    }
    return {
      statusCode: result.$metadata.httpStatusCode,
      key,
    };
  }

  deleteFolder = async (url: string) => {
    const contents = await this.listR2Objects(url);
    const keys = contents
      ?.map((file) => {
        return file.Key;
      })
      .filter(filterUndefined);
    log.info("Delete Folder keys", keys);
    if (!keys) return { statusCode: 400, key: undefined };
    const result = await Promise.all([
      ...keys.map(async (key) => {
        return await this.deleteFile(key);
      }),
    ]);
    return result;
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
    return await Promise.all(results);
  };

  async moveFiles(data: NewMoveFilesData[]) {
    const results = await Promise.all(
      data.map(async ({ sourceKey, destinationKey, deleteSourceKey }) => {
        return {
          result: await R2.send(
            this.s3Commands.copy(sourceKey, destinationKey),
          ),
          sourceKey,
          destinationKey,
          deleteSourceKey,
        };
      }),
    );
    log.info("Move-files results", results).cli();

    const deletePromises = data.map(async ({ sourceKey, deleteSourceKey }) => {
      if (deleteSourceKey) {
        await this.deleteFile(sourceKey);
      }
    });
    await Promise.all(deletePromises);
    return results;
  }

  private getContentBlockFolder = async (key: string) => {
    const objects = await this.listR2Objects(getStringBeforeLastSlash(key));
    let size = 0;
    if (!objects) return undefined;
    for (const obj of objects) {
      if (!obj.Key || !obj.Size) continue;
      const { directoryName } = getBasicDirectoryInfo(
        obj.Key,
        getStringBeforeLastSlash(key),
      );

      if (directoryName !== "course-drive") {
        size += obj.Size;
      }
    }
    return {
      title: "content_block_files",
      size,
    } satisfies StorageCategory | undefined;
  };
}

export const storageOperations = new StorageOperations();
