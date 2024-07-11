import type { TFunction } from "i18next";
import { getFilenameFromUrl } from "pdfjs-dist";
import type { INode } from "react-accessible-treeview";
import useCourse from "@/src/components/course/zustand";
import type { DriveZustand } from "@/src/components/drive/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import type {
  CreateFolderData,
  DriveTypes,
  FileUploadPathData,
  NewMoveFilesData,
  ReducedR2Object,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import {
  deleteCloudflareDirectories,
  listFilesInDirectory,
} from "../client-cloudflare";
import { initializeFileUploader } from "../client-cloudflare/uppy-logic";
import {
  getFileName,
  getKeyFromUrl,
  getStringBeforeLastSlash,
} from "../client-cloudflare/utils";
import confirmAction from "../client-options-modal";
import type { DriveFileTransferOperations } from "./drive-file-transfer-operations";
import type { DriveStateOperations } from "./drive-state-operations";
import type { DriveUtilOperations } from "./drive-util-operations";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class DriveAPIOperations {
  constructor(
    private readonly zustand: () => DriveZustand,
    private readonly driveType: DriveTypes,
    private readonly _state: DriveStateOperations,
    private readonly _utils: DriveUtilOperations,
    private readonly _transfer: DriveFileTransferOperations,
  ) {}

  saveNewFolder = async (element: INode<any>, directoryName: string) => {
    const { setR2Objects, setIdBeingRenamed, r2Objects } = this.zustand();
    const { course } = useCourse.getState();
    const currentId = element.id as string;
    const currentDirectory = this._state.getDirectory(element);

    if (currentDirectory?.name?.startsWith("-new-folder")) {
      if (directoryName === "") {
        setR2Objects(
          this._state.removeDirectory(
            (element.id as string) + "/EmptyGq5GaeYoyabHtCGf.txt",
          ),
        );
        deleteCloudflareDirectories([
          {
            url: process.env.NEXT_PUBLIC_WORKER_URL + "/" + currentId,
            isFolder: true,
          },
        ]);
      } else {
        const destinationKey =
          getStringBeforeLastSlash(currentId) +
          "/" +
          directoryName +
          "/EmptyGq5GaeYoyabHtCGf.txt";
        const sourceKey = currentId + "/EmptyGq5GaeYoyabHtCGf.txt";
        setR2Objects(
          this._state.newUpdateDirectory(r2Objects, sourceKey, {
            Key: destinationKey,
          }),
        );
        console.log("path being created", destinationKey);
        this.createNewFolder({
          folderName: directoryName,
          layerId: course.layer_id,
          type: this.driveType,
          subPath: this._utils.getSubPath(
            this._utils.removeLastSegment(currentId),
          ),
        });
      }
      setIdBeingRenamed("");
    }
  };

  async listFilesInDrive(
    data: FileUploadPathData,
    isReload?: boolean,
  ): Promise<ReducedR2Object[]> {
    const {
      setLoadingFiles,
      setR2Objects,
      setStorageCategories,
      setReloadingFiles,
    } = this.zustand();
    isReload ? setReloadingFiles(true) : setLoadingFiles(true);
    const directories = await listFilesInDirectory(data);

    setStorageCategories(directories.storageCategories);
    setR2Objects(directories.r2Objects);
    isReload ? setReloadingFiles(false) : setLoadingFiles(false);
    return directories.r2Objects;
  }

  async getStorageCategories(data: FileUploadPathData) {
    const { setStorageCategories } = this.zustand();
    const result = await fetch(
      api.getStorageCategories + "?data=" + JSON.stringify(data),
      { method: "GET" },
    );
    if (!result.ok) return;

    setStorageCategories(await result.json());
  }

  saveRenamedFolder = (element: INode<any>, directoryName: string) => {
    const { setIdBeingRenamed, r2Objects } = this.zustand();
    const currentId = element.id as string;
    const currentDirectory = this._state.findR2ObjectById(r2Objects, currentId);
    const directoryObjectName = getFileName(currentDirectory?.Key || "");

    if (!directoryObjectName?.startsWith("-new-folder")) {
      if (directoryName !== "") {
        const newDirectoryId =
          getStringBeforeLastSlash(currentId) + "/" + directoryName;
        const copyValues = this.getRenamedPaths(element, directoryName);
        this._transfer.saveMovedFiles({
          data: copyValues,
          destinationBaseKey: getStringBeforeLastSlash(newDirectoryId),
        });
      }
      setIdBeingRenamed("");
    }
  };

  confirmDeleteDirectory = (
    t: TFunction<"page", undefined>,
    element?: INode<any>,
  ) => {
    const { r2Objects, setR2Objects, selectedIds } = this.zustand();
    const elementId = element?.id as string;
    if (selectedIds.length > 0) {
      const originalR2Objects = [...r2Objects];
      const deletionDirectories = this._state.getDeletionDirectories(element);
      const hasMultiple =
        deletionDirectories.directories.split(", ").length > 1;
      const directories = [...selectedIds, elementId].filter(filterUndefined);
      let containsFolder = false;
      const deleteData = directories.map((id) => {
        const isFolder = this._state.getDirectoryById(id)?.type === "folder";
        if (isFolder) containsFolder = true;
        return {
          url: `${process.env.NEXT_PUBLIC_WORKER_URL}/${id}`,
          isFolder: this._state.getDirectoryById(id)?.type === "folder",
        };
      });
      confirmAction(
        () => {
          deleteCloudflareDirectories(deleteData).then(async (res) => {
            if (!res.ok) setR2Objects(originalR2Objects);
            const result = await res.json();
            this.dealWithFailedDeletionResults(result, originalR2Objects);
          });
          let finalR2Objects = [...r2Objects];
          directories.forEach((id) => {
            finalR2Objects = finalR2Objects.filter(
              (item) => item.Key !== id && !item.Key.includes(id),
            );
          });
          setR2Objects(finalR2Objects);
        },
        {
          title: "delete_drive_items",
          description: t("delete_selected_items", deletionDirectories),
          dangerousAction: true,
          requiredConfirmationCode: hasMultiple || containsFolder,
          actionName: "general.delete",
          cancelName: "general.cancel",
        },
      );
    } else {
      const url = `${process.env.NEXT_PUBLIC_WORKER_URL}/${elementId}`;
      if (!element) return;
      const r2Object = this._state.findR2ObjectById(r2Objects, elementId);
      const directory = this._state.getDirectory(element);
      deleteCloudflareDirectories([
        { url, isFolder: directory?.type === "folder" },
      ]).then((res) => {
        if (!res.ok && r2Object) {
          console.log("whys thishappening", res.ok);
          setR2Objects([...r2Objects, r2Object]);
        }
      });
      setR2Objects(this._state.removeDirectory(elementId as string));
    }
  };

  private getRenamedPaths = (
    element: INode<any>,
    directoryName: string,
  ): NewMoveFilesData[] => {
    const currentId: string = element.id as string;
    const directory = this._state.getDirectory(element);
    if (directory?.type === "folder") {
      const res = this._state.findAllChildIds({ id: currentId }).map((id) => {
        return {
          path: id,
          folderPath: currentId,
        };
      });
      return this._transfer.getCopyValues({
        destinationUrl:
          getStringBeforeLastSlash(currentId) + "/" + directoryName,
        pathsToBeCopied: res,
        deleteOriginalFolders: true,
      });
    } else
      return [
        {
          sourceKey: currentId,
          destinationKey:
            getStringBeforeLastSlash(currentId) + "/" + directoryName,
          deleteSourceKey: true,
        },
      ];
  };

  private async createNewFolder(data: CreateFolderData) {
    const { setR2Objects } = this.zustand();
    const uppy = initializeFileUploader({
      uploadPathData: {
        ...data,
        subPath: (data.subPath ? data.subPath + "/" : "") + data.folderName,
      },
    });
    const content = "empty";
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], "EmptyGq5GaeYoyabHtCGf.txt", {
      type: "text/plain",
    });
    uppy.addFile({
      name: file.name,
      type: file.type,
      data: file,
    });
    const result = await uppy.upload();
    if (result.failed.length > 0) {
      setR2Objects(
        this._state.removeDirectory(
          this._utils.getBasePath() +
            "/" +
            (data.subPath ? data.subPath + "/" : "") +
            data.folderName +
            "/EmptyGq5GaeYoyabHtCGf.txt",
        ),
      );
      toast.error("failed_to_create_folder", {
        description: "failed_to_create_folder_description",
      });
      log.error("Failed to create folder", JSON.stringify(result));
    }
    return result;
  }

  private async dealWithFailedDeletionResults(
    result: { statusCode: number; key: string }[],
    originalR2Objects: ReducedR2Object[],
  ) {
    let finalObjects = [...originalR2Objects];

    if (!result) return;
    result.forEach((r) => {
      if (r.statusCode === 204) {
        finalObjects = finalObjects.filter(
          (obj) => obj.Key !== getKeyFromUrl(r.key),
        );
      } else {
        toast.error("file_deletion_failed", {
          description: "file_deletion_failed_description",
          descriptionVariables: [getFilenameFromUrl(r.key)],
        });
      }
    });
    this.zustand().setR2Objects(finalObjects);
  }
}
