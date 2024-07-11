import {
  getBasicDirectoryInfo,
  getStringBeforeLastSlash,
} from "@/src/client-functions/client-cloudflare/utils";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import type {
  DeleteMultipleDirectoriesData,
  InstitutionAndStorageInfo,
  InstitutionR2ObjectCreateInput,
  ListDirectoryReturnData,
  NewMoveFilesData,
  ReducedR2Object,
  StorageCategory,
  UploadPathDataWithFile,
  UploadPathType,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../../../db/client";
import { getInstitutionWithStorageSizeAndSettings } from "../../server-institution-settings";
import {
  aggregateSizes,
  decodeAndGetKey,
  defaultStorageCategories,
  getValueAfterSegment,
} from "../utils";

export class DBStorageOperations {
  async getInstitutionWithStorageSettings(
    userId: string,
    uploadPathType?: UploadPathType,
  ): Promise<InstitutionAndStorageInfo> {
    const institution = await getInstitutionWithStorageSizeAndSettings(userId);

    const settings = institution?.settings.settings as InstitutionSettings;

    const stripeAccount = institution?.stripeAccount;
    const r2Objects = institution?.r2Objects;
    if (uploadPathType === "logo") {
      return {
        institutionId: undefined,
        storageInfo: undefined,
      };
    }
    const storageInfo = {
      courseLimit: settings.storage_course_limit,
      userLimit: settings.storage_user_limit,
      baseGB: settings.storage_base_gb,
      gbPerUser: settings.storage_gb_per_user,
      r2Objects: r2Objects,
    };
    return {
      institutionId: institution?.settings.institutionId,
      storageInfo,
      stripeAccount,
    };
  }

  async getStorageCategories(
    data: UploadPathDataWithFile,
    institutionId?: string,
  ) {
    if (!institutionId) return [];
    const objects = await this.listR2Objects(institutionId);
    switch (data.type) {
      case "course-drive":
        const key = `institutions/${institutionId}/layer/${data.layerId}`;
        if (!objects) return defaultStorageCategories;
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
        return defaultStorageCategories;
    }
  }

  async getLayerSizes(institutionId: string) {
    try {
      const objects = await this.listR2Objects(institutionId);
      if (!objects) return [];
      const data = objects
        .filter((obj) =>
          obj.Key.startsWith("institutions/" + institutionId + "/layer"),
        )
        .map((obj) => {
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
    const objects = await this.listR2Objects(institutionId);
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

  async getStorageSize(institutionId: string, key: string, subPath?: string) {
    const objects = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { r2Objects: true },
    });
    log.info("objects db getStorageSize:", objects).cli();

    if (!objects) return { totalStorageSize: 0, subStorageSize: 0 };
    const totalStorageSize = objects.r2Objects
      .filter((obj) => obj.key.startsWith(key))
      .reduce((acc, curr) => acc + curr.size, 0);
    let subPathSize: number | undefined;
    if (subPath) {
      subPathSize = objects.r2Objects
        .filter((obj) => obj.key.startsWith(subPath))
        .reduce((acc, curr) => acc + curr.size, 0);
    }

    log
      .info("result db getStorageSize:", {
        totalStorageSize,
        subStorageSize: subPath ? subPathSize : undefined,
      })
      .cli();
    return {
      totalStorageSize,
      subStorageSize: subPath ? subPathSize : undefined,
    };
  }

  async deleteInstitutionR2Object(key: string) {
    try {
      return await prisma.institutionR2Object.deleteMany({
        where: { key: decodeAndGetKey(key) },
      });
    } catch (error) {
      log
        .error("Error in deleteInstitutionR2Object", JSON.stringify(error))
        .cli();
    }
  }

  async deleteR2Folders(key: string) {
    return await prisma.institutionR2Object.deleteMany({
      where: {
        key: {
          startsWith: decodeAndGetKey(key),
        },
      },
    });
  }

  async deleteDirectories(data: DeleteMultipleDirectoriesData) {
    return await Promise.all(
      data.map(async (directory) => {
        if (directory.isFolder) {
          await this.deleteR2Folders(directory.url);
        } else {
          await this.deleteInstitutionR2Object(directory.url);
        }
      }),
    );
  }

  listObjectsWithCategories = async (key: string) => {
    const objects = await this.listR2Objects(
      getValueAfterSegment({ segment: "institutions", url: key })!,
    );
    const finalObjects = objects.filter((obj) => obj.Key.startsWith(key));
    const returnData: ListDirectoryReturnData = {
      r2Objects: finalObjects,
      storageCategories: this.getCategoriesForKey(key, objects),
    };
    return returnData;
  };

  getCategoriesForKey = (key: string, objects: ReducedR2Object[]) => {
    const categories: StorageCategory[] = [];
    if (key.split("/").pop() === "course-drive" && objects.length > 0) {
      categories.push(
        {
          title: "course-drive",
          size: objects
            .filter((obj) => obj.Key.includes(key))
            .reduce((acc, curr) => acc + curr.Size, 0),
        },
        {
          title: "content_block_files",
          size: objects
            .filter((obj) => {
              if (!obj.Key.includes(getStringBeforeLastSlash(key)))
                return false;
              const directoryName = getBasicDirectoryInfo(
                obj.Key,
                getStringBeforeLastSlash(key),
              ).directoryName;
              return directoryName !== "course-drive";
            })
            .reduce((acc, curr) => acc + curr.Size, 0),
        },
      );
    }
    return categories;
  };

  async copyInstitutionR2Objects(moveFileData: NewMoveFilesData[]) {
    const sourceKeys = moveFileData.map((data) => data.sourceKey);
    const sourceObjects = await prisma.institutionR2Object.findMany({
      where: {
        key: {
          in: sourceKeys,
        },
      },
    });
    const updatePromises = moveFileData.map((moveFileObject) => {
      const destinationObject = sourceObjects.find(
        (data) => data.key === moveFileObject.sourceKey,
      );
      if (!destinationObject) return;
      if (moveFileObject.deleteSourceKey) {
        return prisma.institutionR2Object.updateMany({
          where: { key: moveFileObject.sourceKey },
          data: {
            key: moveFileObject.destinationKey,
            lastModified: new Date(),
          },
        });
      } else {
        return prisma.institutionR2Object.create({
          data: {
            ...destinationObject,
            key: moveFileObject.destinationKey,
            lastModified: new Date(),
          },
        });
      }
    });
    await Promise.all(updatePromises);
  }

  async createInstitutionR2Objects(data: InstitutionR2ObjectCreateInput[]) {
    if (data[0]) {
      const institutionId = getValueAfterSegment({
        segment: "institutions",
        url: data[0].key,
      });
      if (!institutionId) return;
      const objects = data.map((obj) => {
        return {
          key: decodeAndGetKey(obj.key),
          size: obj.size,
          lastModified: obj.lastModified,
        };
      });
      await prisma.institution.update({
        where: { id: institutionId },
        data: {
          r2Objects: {
            createMany: {
              data: objects,
            },
          },
        },
      });
    }
  }

  async listR2Objects(institutionId: string) {
    const objects = await prisma.institutionR2Object.findMany({
      where: {
        institutionId,
      },
    });
    return objects.map((obj) => {
      return {
        Key: obj.key,
        Size: obj.size,
        LastModified: obj.lastModified,
      } as ReducedR2Object;
    });
  }
}

export const dbStorageOperations = new DBStorageOperations();
