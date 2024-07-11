import type Uppy from "@uppy/core";
import { track } from "@vercel/analytics";
import type { INode } from "react-accessible-treeview";
import useCourse from "@/src/components/course/zustand";
import { useUserDriveModal } from "@/src/components/dashboard/navigation/primary-sidebar/user-drive/zustand";
import type { DriveZustand } from "@/src/components/drive/zustand";
import { useCourseDriveUploader } from "@/src/components/reusable/file-uploaders/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import type {
  DriveTypes,
  PathsToBeCopied,
  ReducedR2Object,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import {
  BYTES_IN_1MB,
  filterUndefined,
  isJsonObject,
  tryReadJsonFromClipboard,
} from "@/src/utils/utils";
import { initializeFileUploader } from "../client-cloudflare/uppy-logic";
import {
  determineDriveTransferType,
  getFileName,
} from "../client-cloudflare/utils";
import { delay, downloadFileFromUrl } from "../client-utils";
import type { DriveFileTransferOperations } from "./drive-file-transfer-operations";
import type { DriveStateOperations } from "./drive-state-operations";
import type { DriveUtilOperations } from "./drive-util-operations";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class DriveInteractionOperations {
  constructor(
    private readonly zustand: () => DriveZustand,
    private readonly driveType: DriveTypes,
    private readonly _utils: DriveUtilOperations,
    private readonly _state: DriveStateOperations,
    private readonly _transfer: DriveFileTransferOperations,
  ) {}
  handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const { focusedDrive } = useUserDriveModal.getState();
    const isRelevantPaste =
      ((event.clipboardData && event.clipboardData.files.length > 0) ||
        event.clipboardData?.getData("text/plain")) &&
      focusedDrive === this.driveType;

    if (isRelevantPaste) {
      const files: FileList = event.clipboardData.files;
      const firstFile = await tryReadJsonFromClipboard();

      const isDriveToDrivePaste =
        firstFile &&
        isJsonObject(firstFile) &&
        "pathsToBeCopied" in firstFile &&
        Array.isArray(firstFile.pathsToBeCopied);

      if (isDriveToDrivePaste) {
        await this.handleMoveFilesInsideOfDrive(
          this.getDeepestDropPath(),
          firstFile.pathsToBeCopied as unknown as PathsToBeCopied[],
          false,
        );
      } else {
        await this.handleMoveFilesIntoDrive(
          event,
          this.getDeepestDropPath(),
          files,
        );
      }
    }
  };

  async handleDoubleClickOnDirectory(element: INode<any>) {
    const { setOpenedFolderId } = this.zustand();
    const elementId = element.id as string;
    const currentDirectory = this._state.getDirectory(element);
    if (currentDirectory?.type === "folder") {
      setOpenedFolderId(elementId);
      this._state.setNewDeepestFolderId(elementId);
    } else {
      await downloadFileFromUrl(
        element.name,
        `${process.env.NEXT_PUBLIC_WORKER_URL}/${element.id}`,
        true,
      );
    }
  }

  handleCopy = async (event: KeyboardEvent) => {
    const { focusedDrive } = useUserDriveModal.getState();
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "c" &&
      focusedDrive === this.driveType
    ) {
      await navigator.clipboard.writeText(
        JSON.stringify({
          pathsToBeCopied: this._transfer.getPathsToBeCopied(this.driveType),
        }),
      );
    }
  };
  //Check if this can be removed
  handleDropInSubfolder = async ({
    e,
    setIsCurrentElementBeingDraggedOver,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    setIsCurrentElementBeingDraggedOver: (b: boolean) => void;
  }) => {
    const { setIsDriveBeingDraggedOver } = this.zustand();

    e.preventDefault();
    setIsDriveBeingDraggedOver(false);
    this.handleDrop(e);
    e.stopPropagation();
    setIsCurrentElementBeingDraggedOver(false);
  };

  /**
   * Handles the event when a draggable element is over a drop target.
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  handleDragOver = (e, dragContainerRef) => {
    const { setIsDriveBeingDraggedOver } = this.zustand();
    e.preventDefault();
    setIsDriveBeingDraggedOver(true);
    const container = dragContainerRef.current;
    const rect = container.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    // Calculate dynamic scroll speed based on cursor proximity to the edge
    let scrollSpeed = 0;
    const edgeThreshold = 50; // Distance from edge to start scrolling

    if (offsetY < edgeThreshold) {
      // Closer to top edge, calculate speed
      scrollSpeed = ((-1 * (edgeThreshold - offsetY)) / edgeThreshold) * 20; // Max speed 20
    } else if (rect.bottom - e.clientY < edgeThreshold) {
      // Closer to bottom edge, calculate speed
      scrollSpeed =
        ((edgeThreshold - (rect.bottom - e.clientY)) / edgeThreshold) * 20; // Max speed 20
    }

    // Apply the calculated scroll speed
    container.scrollTop += scrollSpeed;
  };

  handleDrop = async (event) => {
    try {
      const { setFolderBeingDraggedOver } = this.zustand();
      const folderBeingDroppedInto = this.getDeepestDropPath();
      if (!this._utils.hasWriteAccess()) {
        setFolderBeingDraggedOver("");
        return;
      }

      await this.processDrop(folderBeingDroppedInto, event);
      await this.resetFolderBeingDraggedOver();
    } catch (error) {
      const e = error as Error;
      log.error("Error handling file drop: " + e.message);
    }
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    const { setIsDriveBeingDraggedOver, setFolderBeingDraggedOver } =
      this.zustand();
    e.preventDefault();
    setFolderBeingDraggedOver("");
    setIsDriveBeingDraggedOver(false);
  };

  private getNestedSubPath = () => {
    const { openedFolderId, folderBeingDraggedOver } = this.zustand();
    return folderBeingDraggedOver !== ""
      ? this._utils.getSubPath(folderBeingDraggedOver)
      : openedFolderId !== ""
      ? this._utils.getSubPath(openedFolderId)
      : undefined;
  };

  private getDeepestDropPath = () => {
    const { openedFolderId, folderBeingDraggedOver } = this.zustand();
    return folderBeingDraggedOver !== ""
      ? folderBeingDraggedOver
      : openedFolderId !== ""
      ? openedFolderId
      : this._utils.getBasePath();
  };

  private handleMoveFilesInsideOfDrive = async (
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
    let copyValues = this._transfer.getCopyValues(dropValues);

    if (pathsToBeCopied.length === 0 || !pathsToBeCopied[0]) return;
    const transferType = determineDriveTransferType(copyValues);

    if (
      (!hasSpecialRole && transferType?.includes("to-course-drive")) ||
      folderIdBeingDroppedInto === currentlyDragging
    ) {
      return;
    }
    copyValues = this._transfer.filterInvalidMoveValues(copyValues);
    copyValues = this._transfer.filterDuplicateNamesFromCopyValues(
      copyValues,
      r2Objects,
    );

    await this._transfer.saveMovedFiles({
      data: copyValues,
      destinationBaseKey: folderIdBeingDroppedInto,
    });
    return copyValues;
  };

  private mapFileNameToNewPath = (
    files: File[],
    dropPath: string,
  ): string[] => {
    return files.map((file) => {
      return `${dropPath}/${file.name}`;
    });
  };

  private handleMoveFilesIntoDrive = async (
    event,
    dropPath: string,
    filesFromPaste?: FileList,
  ) => {
    let files = this.getFilesFromEventOrPaste(filesFromPaste, event);
    files = files.filter((file) => {
      const isTooLarge = file.size > BYTES_IN_1MB * 300;
      if (isTooLarge) {
        toast.error("file_too_large", {
          description: "file_too_large-description",
          descriptionVariables: ["300MB"],
        });
      }
      return file.size < BYTES_IN_1MB * 300;
    });
    if (files.length === 0) return;

    const uppy = this.setupFileUploader();
    this.trackFileUploads(files);

    const generatedFileIds = this.mapFileNameToNewPath(files, dropPath);
    const newFileIds = this._transfer.checkDuplicateNames(generatedFileIds);
    const newFiles = newFileIds
      .map((file) => {
        return files.map((f) => {
          if (f.name === getFileName(file)) return f;
        });
      })
      .flat()
      .filter(filterUndefined);

    const { setIdsBeingUploaded, idsBeingUploaded } = this.zustand();
    setIdsBeingUploaded([...idsBeingUploaded, ...generatedFileIds]);
    this.uploadFilesWithUppy(newFiles, uppy, dropPath).then(() => {
      const { setIdsBeingUploaded, idsBeingUploaded } = this.zustand();
      setIdsBeingUploaded(
        idsBeingUploaded.filter((id) => !generatedFileIds.includes(id)),
      );
    });
  };

  private getFilesFromEventOrPaste = (
    filesFromPaste?: FileList,
    event?: any,
  ): File[] => {
    return Array.from(filesFromPaste ?? event.dataTransfer.files);
  };

  private setupFileUploader = () => {
    const { course } = useCourse.getState();
    const { setUppy } = useCourseDriveUploader.getState();
    const uppy = initializeFileUploader({
      uploadPathData:
        this.driveType === "user-drive"
          ? { type: this.driveType }
          : {
              type: this.driveType,
              layerId: course.layer_id,
              subPath: this.getNestedSubPath(),
            },
      maxFileAmount: 200,
    });
    setUppy(uppy);
    return uppy;
  };

  private trackFileUploads = (files: File[]) => {
    files.forEach((file) => {
      track("Uploaded Files to Drive", {
        driveType: this.driveType,
        fileType: file.type,
      });
    });
  };

  private uploadFilesWithUppy = async (
    files: File[],
    uppy: Uppy<Record<string, unknown>, Record<string, unknown>>,
    dropPath: string,
  ) => {
    const { setIdsBeingUploaded, idsBeingUploaded } = this.zustand();
    const basePath = this._utils.getBasePath();
    const subPath = this.getNestedSubPath();
    const uploadedFileIds: { identifier: string; id: string }[] = [];
    files.forEach((file) => {
      const fileId = `${basePath}/${subPath ? `${subPath}/` : ""}${file.name}`;
      const dummyFile: ReducedR2Object = {
        Key: fileId,
        Size: file.size,
        LastModified: new Date(),
      };
      this._state.addDummySubDirectory(dropPath, dummyFile);
      const uppyFile = {
        name: file.name,
        type: file.type,
        data: file,
      };
      uppy.addFile(uppyFile);
    });
    if (files.length > 0) await uppy.upload();
  };

  private processDrop = async (folderBeingDroppedInto: string, event) => {
    const { currentlyDragging } = this.zustand();
    const { currentlyDragging: oppositeCurrentlyDragging } =
      this._utils.getOppositeZustand();
    if (currentlyDragging && !oppositeCurrentlyDragging) {
      await this.handleMoveFilesInsideOfDrive(
        folderBeingDroppedInto,
        this._transfer.getPathsToBeCopied(this.driveType),
        true,
      );
    } else if (!currentlyDragging && oppositeCurrentlyDragging) {
      await this.handleMoveFilesInsideOfDrive(
        folderBeingDroppedInto,
        this._transfer.getPathsToBeCopied(this._utils.getOppositeDriveType()),
        false,
      );
    } else {
      await this.handleMoveFilesIntoDrive(event, folderBeingDroppedInto);
    }
  };

  private resetFolderBeingDraggedOver = async () => {
    const { setFolderBeingDraggedOver } = this.zustand();
    const { setFolderBeingDraggedOver: setOppositeFolderBeingDraggedOver } =
      this._utils.getOppositeZustand();
    await delay(100);
    setFolderBeingDraggedOver("");
    setOppositeFolderBeingDraggedOver("");
  };
}
