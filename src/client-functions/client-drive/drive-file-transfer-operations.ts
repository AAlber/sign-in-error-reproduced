import { getFilenameFromUrl } from "pdfjs-dist";
import useCourse from "@/src/components/course/zustand";
import type { DriveZustand } from "@/src/components/drive/zustand";
import { useCourseDrive, useUserDrive } from "@/src/components/drive/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { decodeAndGetKey } from "@/src/server/functions/server-cloudflare/utils";
import type {
  BackendMoveFilesData,
  DriveTypes,
  LimitReachedError,
  MoveFilesData,
  MoveFilesResult,
  NewMoveFilesData,
  PathsToBeCopied,
  ReducedR2Object,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined, getSubstringAfterWord } from "@/src/utils/utils";
import { dealWithStorageLimitErrors } from "../client-cloudflare/uppy-logic";
import {
  determineDriveTransferType,
  getKeyFromUrl,
  getStringBeforeLastSlash,
  isLimitReachedError,
  reverseMoveFileData,
  storageLimitErrors,
} from "../client-cloudflare/utils";
import type { DriveStateOperations } from "./drive-state-operations";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class DriveFileTransferOperations {
  constructor(
    private readonly zustand: () => DriveZustand,
    private readonly _state: DriveStateOperations,
  ) {}

  saveMovedFiles = async (data: BackendMoveFilesData) => {
    const { setR2Objects } = this.zustand();
    if (data.data.length === 0) return;
    this.validateFileMoving(data.data);
    setR2Objects(this.moveFilesLocally(data.data));
    const res = await fetch(api.moveFiles, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      if (result.message && storageLimitErrors.includes(result.message)) {
        dealWithStorageLimitErrors(result);
      } else {
        toast.error("file_transfer_failed", {
          description: "file_transfer_failed_description",
        });
      }
      this.reverseMoveFileOperation(data.data);
    } else {
      this.dealWithPartialMovingSuccess(result);
    }
    return result;
  };

  handleMoveFilesInsideOfDrive = async (
    folderIdBeingDroppedInto: string,
    pathsToBeCopied: PathsToBeCopied[],
    deleteOriginalFolders: boolean,
  ) => {
    const { r2Objects, currentlyDragging } = this.zustand();
    const { hasSpecialRole } = useCourse.getState();
    const destinationUrl =
      process.env.NEXT_PUBLIC_WORKER_URL + "/" + folderIdBeingDroppedInto;
    const dropValues = {
      destinationUrl,
      pathsToBeCopied,
      deleteOriginalFolders,
    };
    let copyValues = this.getCopyValues(dropValues);

    if (pathsToBeCopied.length === 0 || !pathsToBeCopied[0]) return;
    const transferType = determineDriveTransferType(copyValues);

    if (
      (!hasSpecialRole && transferType?.includes("to-course-drive")) ||
      folderIdBeingDroppedInto === currentlyDragging
    ) {
      return;
    }
    copyValues = this.filterInvalidMoveValues(copyValues);
    copyValues = this.filterDuplicateNamesFromCopyValues(copyValues, r2Objects);

    await this.saveMovedFiles({
      data: copyValues,
      destinationBaseKey: folderIdBeingDroppedInto,
    });
    return copyValues;
  };

  moveFilesLocally = (data: NewMoveFilesData[]) => {
    const { r2Objects } = this.zustand();
    const newR2Objects = [...r2Objects];
    data.map(({ sourceKey, destinationKey, deleteSourceKey }) => {
      const sourceIndex = newR2Objects.findIndex(
        (obj) => obj.Key === sourceKey,
      );
      const obj = newR2Objects[sourceIndex];
      if (sourceIndex !== -1 && obj) {
        if (deleteSourceKey) {
          obj.Key = destinationKey;
          obj.LastModified = new Date();
        } else {
          const newObj = {
            Size: obj.Size,
            Key: destinationKey,
            LastModified: new Date(),
          };
          newR2Objects.push(newObj);
        }
      }
    });
    return newR2Objects;
  };

  getCopyValues = (data: MoveFilesData): NewMoveFilesData[] => {
    return data.pathsToBeCopied.map(({ folderPath, path }) => {
      let newKey =
        decodeAndGetKey(data.destinationUrl) +
        getSubstringAfterWord(path, folderPath!);
      if (path === folderPath) {
        newKey = decodeURIComponent(path);
      }
      return {
        sourceKey: path,
        destinationKey: newKey,
        deleteSourceKey: data.deleteOriginalFolders || false,
        newBaseKey: data.destinationUrl,
      };
    });
  };

  filterInvalidMoveValues = (data: NewMoveFilesData[]) => {
    return data.filter((value) => {
      return value.sourceKey !== value.destinationKey;
    });
  };

  getPathsToBeCopied = (driveType: DriveTypes): PathsToBeCopied[] => {
    const { currentlyDragging, r2Objects, selectedIds } =
      this.getDriveState(driveType);
    const filteredSelectedIds = selectedIds.filter(
      (id) => !currentlyDragging.includes(id) && id !== currentlyDragging,
    );
    return this.formatPathsToBeCopied({
      idsBeingMoved:
        currentlyDragging === ""
          ? selectedIds
          : [currentlyDragging, ...filteredSelectedIds],
      r2Objects,
    });
  };

  formatPathsToBeCopied = ({
    folderIdBeingDroppedInto,
    idsBeingMoved,
    r2Objects,
  }: {
    folderIdBeingDroppedInto?: string;
    idsBeingMoved: string[];
    r2Objects: ReducedR2Object[];
  }) => {
    let parentIds = this.findParentMostIds(idsBeingMoved);
    parentIds = parentIds.filter((t) => t !== folderIdBeingDroppedInto);
    const paths: PathsToBeCopied[] = [];
    parentIds.forEach((id) => {
      r2Objects.forEach((obj) => {
        if (obj.Key.startsWith(id)) {
          const pathTobeCopied: PathsToBeCopied = {
            path: obj.Key,
            folderPath: getStringBeforeLastSlash(id),
          };
          paths.push(pathTobeCopied);
        }
      });
    });

    log.info("pathsToBeCopied", paths).cli();
    return paths;
  };

  filterDuplicateNamesFromCopyValues = (
    copyValues: NewMoveFilesData[],
    r2Objects: ReducedR2Object[],
  ) => {
    const directoriesWithUniqueNamesInFolder = this.checkDuplicateNames(
      copyValues.map((value) => value.destinationKey),
    );
    return directoriesWithUniqueNamesInFolder
      .map((id) => {
        const copyValue = copyValues.find(
          (value) => value.destinationKey === id,
        );
        if (!copyValue) return;
        const originalObject = this._state.findR2ObjectById(
          r2Objects,
          copyValue?.sourceKey,
        );
        if (!originalObject) {
          log.error("originalObject not found", copyValue.sourceKey).cli();
          return;
        }
        return copyValue;
      })
      .filter(filterUndefined);
  };

  checkDuplicateNames(newFileIds: string[]): string[] {
    const { r2Objects } = this.zustand();
    const existingIds = r2Objects.map((obj) => obj.Key);
    const filesThatExistAlready: string[] = [];
    const newFiles: string[] = [];
    newFileIds.forEach((id) => {
      if (!id) return;
      if (existingIds.includes(id)) {
        filesThatExistAlready.push(id);
      } else {
        newFiles.push(id);
      }
    });

    if (filesThatExistAlready.length > 0) {
      if (
        filesThatExistAlready.every(
          (file) => getKeyFromUrl(file) === "EmptyGq5GaeYoyabHtCGf.txt",
        )
      )
        return newFiles;
      toast.error("files_exist_already", {
        duration: 10000,
        description: "files_exist_already_description",
        descriptionVariables: [
          filesThatExistAlready
            .map((file) => getFilenameFromUrl(file))
            .filter((name) => name !== "EmptyGq5GaeYoyabHtCGf.txt")
            .join(", "),
        ],
      });
    }
    return newFiles;
  }

  private validateFileMoving = (data: NewMoveFilesData[]) => {
    return data.filter(({ sourceKey, destinationKey }) => {
      return sourceKey !== destinationKey;
    });
  };

  private findParentMostIds = (selectedIds: string[]): string[] => {
    // Function to check if one ID is a parent of another
    const isParentOf = (parentId: string, childId: string): boolean => {
      return childId.startsWith(parentId) && childId !== parentId;
    };

    // Filter the selected IDs to find the top-level parents
    const topLevelParents: string[] = selectedIds.filter((id) => {
      return !selectedIds.some((otherId) => isParentOf(otherId, id));
    });

    return topLevelParents;
  };

  private getDriveState(driveType: DriveTypes) {
    return driveType === "user-drive"
      ? useUserDrive.getState()
      : useCourseDrive.getState();
  }

  private async reverseMoveFileOperation(data: NewMoveFilesData[]) {
    const { setR2Objects } = this.zustand();
    const finalData = reverseMoveFileData(data);
    setR2Objects(Array.from(new Set(this.moveFilesLocally(finalData))));
  }

  private async dealWithPartialMovingSuccess(
    results: MoveFilesResult[] | LimitReachedError,
  ) {
    const failedResults: MoveFilesResult[] = [];
    if (isLimitReachedError(results)) {
      dealWithStorageLimitErrors(results);
    } else {
      results.forEach((result) => {
        if (!result.result) {
          log.error("Failed moving operation", JSON.stringify(result)).cli();
        }
        if (result.result.$metadata.httpStatusCode !== 200) {
          log.error("Failed moving operation", JSON.stringify(result)).cli();
          failedResults.push(result);
        }
      });
    }
    const newMoveFilesData = reverseMoveFileData(failedResults);
    this.reverseMoveFileOperation(newMoveFilesData);
  }
}
