import { toast } from "@/src/components/reusable/toaster/toast";
import type { DownloadFileType } from "../../../client-functions/client-firebase";
import {
  deleteFirebaseFileOrFolder,
  downloadFirebaseFile,
  FirebaseUploadType,
  getFileBlob,
  getFirebaseDownloadLink,
  loadFilesFromPath,
  renameFirebaseFileOrFolder,
  uploadToFirebase,
} from "../../../client-functions/client-firebase";
import type {
  CreateNewFolder,
  DeleteDirectory,
  DownloadFile,
  DragIntoFolder,
  GetDownloadLink,
  GetSingleFileBlob,
  LoadFiles,
  LoadFilesInput,
  Rename,
  UploadFileToDrive,
} from "./drive";
import { Drive } from "./drive";

export const EMPTY_FILE = "EmptyGq5GaeYoyabHtCGf.txt";

export class FuxamDrive extends Drive {
  id = 0;

  getSingleFileBlob: GetSingleFileBlob;
  downloadFile: DownloadFile;
  getDownloadLink: GetDownloadLink;
  uploadFileToDrive: UploadFileToDrive;
  createNewFolder: CreateNewFolder;
  deleteFileOrFolder: DeleteDirectory;
  dragIntoFolder: DragIntoFolder;
  renameFileOrFolder: Rename;
  loadFiles: LoadFiles;

  constructor(
    userId: string,
    currentFiles: any[],
    lastFolder: string | null,
    path: string,
    setPath?: (path: string) => void,
    setLastFolder?: (path: string | null) => void,
    setLoaded?: (isLoaded: boolean) => void,
    setFiles?: (path: string | null) => void,
    setUploadStep?: (step: number | null) => void,
  ) {
    super(
      userId,
      currentFiles,
      lastFolder,
      path,
      setPath,
      setLastFolder,
      setLoaded,
      setFiles,
      setUploadStep,
    );
    this.loadFiles = async (args: LoadFilesInput) => {
      const { loadPathOrFileId, nextPageToken, getResult } = args;
      const shouldReturnFiles = getResult === undefined ? false : getResult;
      try {
        const files = await loadFilesFromPath(loadPathOrFileId, nextPageToken);
        !shouldReturnFiles && this.setFiles && this.setFiles(files);
        if (getResult === true) return Promise.resolve(files && files);
      } catch (e) {
        toast.error("toast_fuxam_drive_error1", {
          description: (e as Error).message,
        });
      }
    };
    this.getSingleFileBlob = async (file: any, userId: string) => {
      try {
        const fileLocation = "/" + file.id;
        return await getFileBlob(fileLocation);
      } catch (e) {
        toast.error("toast_fuxam_drive_error1", {
          description: (e as Error).message,
        });
      }
    };
    this.downloadFile = async (fileId: string) => {
      const fileLocation = fileId.replace(`users/${userId}`, "");
      return downloadFirebaseFile("/" + fileLocation);
    };

    this.getDownloadLink = (file: DownloadFileType) => {
      const fileLocation = file.id.replace(`users/${userId}`, "");
      return getFirebaseDownloadLink("/" + fileLocation);
    };

    this.uploadFileToDrive = async (
      file,
      folderName?,
      fileName?,
      fileType?,
    ) => {
      const name: string = fileName ? fileName : file.name;
      const isFolder = folderName !== undefined;
      if (checkFileName((isFolder ? folderName : name)!, isFolder)) return;
      try {
        if (folderName) {
          await this.uploadProgress(
            uploadToFirebase(
              file,
              `/Files/${this.path + folderName + "/" + EMPTY_FILE}`,
              "folder",
              FirebaseUploadType.User,
            ).then(() => {
              this.loadFiles({ loadPathOrFileId: this.path });
            }),
          );
        } else {
          await this.uploadProgress(
            uploadToFirebase(
              file,
              `/Files/${this.path + name}`,
              fileType ? fileType : file?.type,
              FirebaseUploadType.User,
            ).then(() => {
              this.loadFiles({ loadPathOrFileId: this.path });
            }),
          );
        }
      } catch (e) {
        this.setUploadStepToNull();
        toast.error("toast_fuxam_drive_error2", {
          description: (e as Error).message,
        });
      }
    };

    this.createNewFolder = async (folderName: string) => {
      this.uploadFileToDrive(Uint8Array.from([]), folderName);
    };

    this.deleteFileOrFolder = async (file: DownloadFileType) => {
      const ending = this.isFolder(file) ? "/" : "";
      //TODO: Need to remove the initial part and only add that in the backend
      try {
        await this.uploadProgress(
          deleteFirebaseFileOrFolder(
            `/Files/${this.path + file.name + ending}`,
          ).then(() => {
            this.loadFiles({ loadPathOrFileId: this.path });
          }),
        );
      } catch (e) {
        this.setUploadStepToNull();
        toast.error(`Deleting the drive directory ${file.name}`, {
          description: (e as Error).message,
        });
      }
    };

    this.dragIntoFolder = async (
      targetFolderId: string,
      draggedDirectoryId: string,
      draggedIsFolder: boolean,
    ) => {
      try {
        const file = this.getFile(targetFolderId);
        if (!this.isFolder(file!)) return;
        await this.uploadProgress(
          fetch("/api/firebase/move-into-subfolder", {
            method: "POST",
            body: JSON.stringify({
              userId: userId,
              targetFolderId: "/" + targetFolderId + "/",
              draggedDirectoryId:
                "/" + draggedDirectoryId + (draggedIsFolder ? "/" : ""),
            }),
          }),
        );
      } catch (e) {
        this.setUploadStepToNull();
        toast.error("toast_fuxam_drive_error4", {
          description: (e as Error).message,
        });
      }
    };

    this.renameFileOrFolder = async (
      fileId: string,
      oldName: string,
      newName: string,
      fileType?: string,
    ) => {
      const file = this.getFile(fileId);
      const ending = this.isFolder(file!) ? "/" : "";
      if (checkFileName(newName, this.isFolder(file!))) return;
      try {
        await this.uploadProgress(
          renameFirebaseFileOrFolder({
            originalPath: this.path + oldName + ending,
            newEnding: this.isFolder(file!)
              ? newName
              : getNewNameWithExtension(oldName, newName),
            userId: userId,
          }),
        ).then(async () => {
          await this.loadFiles({
            loadPathOrFileId: this.path,
            getResult: false,
          });
        });
      } catch (e) {
        this.setUploadStepToNull();
        toast.error("toast_fuxam_drive_error5", {
          description: (e as Error).message,
        });
      }
    };
  }
}

export function getNewNameWithExtension(
  oldName: string,
  newName: string,
): string {
  if (newName.includes("/") || newName === "") {
    throw new Error(
      "Invalid new file name! It must have at least one character and cannot contain slashes.",
    );
  }

  const lastDotIndex = oldName.lastIndexOf(".");
  const extension = lastDotIndex !== -1 ? oldName.slice(lastDotIndex) : "";

  if (newName.endsWith(".") && extension === "") {
    return newName;
  }
  return newName + extension;
}

export function hasSlashAtEitherEnd(s: string): boolean {
  return s.startsWith("/") || s.endsWith("/");
}
export function hasSlash(s: string): boolean {
  return s.includes("/");
}

export const checkFileName = (newName: string, isFolder: boolean) => {
  if (isFolder) {
    if (hasSlashAtEitherEnd(newName)) {
      toast.warning("toast_fuxam_drive_error6", {
        description: "toast_fuxam_drive_error7",
      });
      return true;
    }
  } else {
    if (hasSlash(newName)) {
      toast.warning("toast_fuxam_drive_error6", {
        description: "toast_fuxam_drive_error8",
      });
      return true;
    }
  }
  return false;
};
