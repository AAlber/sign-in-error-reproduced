// import AdmZip from "adm-zip";
// import FileSaver from "file-saver";
import { default as pathy } from "path";
import type { DownloadFileType } from "@/src/client-functions/client-firebase";
import useDragObject from "../../../zustand/dragged-object";

export abstract class Drive {
  /** Assigned in the constructor */
  abstract id: number;
  public userId: string;
  public path: string;
  public setPath: ((path: string) => void) | undefined;
  public lastFolder: string | null;
  public currentFiles: any[];
  public setLastFolder: ((path: string | null) => void) | undefined;
  public downloadFolder: (pathOrFileId, fileName) => Promise<void>;
  private createFolderStructure: CreateFolderStructure;
  public setLoaded: ((isLoaded: boolean) => void) | undefined;
  public setFiles?: (files: any) => void;
  public setUploadStep: ((step: number | null) => void) | undefined;
  public checkDirectoryExistsAlready: (fileId: any) => any;

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
    this.currentFiles = currentFiles;
    this.path = path;
    this.setUploadStep = (step) => {
      setUploadStep && setUploadStep(step);
    };
    this.lastFolder = lastFolder;
    this.setPath = (path) => {
      setPath && setPath(path);
      this.path = path;
    };
    this.setFiles = async (files: any) => {
      setFiles && setFiles(files);
      this.currentFiles = files;
    };
    this.setLoaded = (isLoaded: boolean) => setLoaded && setLoaded(isLoaded);
    this.setLastFolder = (path: string | null) => {
      setLastFolder && setLastFolder(path);
      this.lastFolder = path;
    };
    this.userId = userId;
    this.deleteMultipleFilesAndFolders = async () => {
      const promises: Promise<any>[] = [];
      this.currentFiles.forEach(async (file) => {
        this.filterId(file.id, this.setFiles);
        promises.push(this.deleteFileOrFolder(file));
      });
      return await Promise.all(promises);
    };
    this.runDragIntoFolder = async (targetFolderId, draggedDirectoryId) => {
      const draggedDirectory = this.getFile(draggedDirectoryId);
      const draggedIsFolder = this.isFolder(draggedDirectory!);
      const { setData } = useDragObject.getState();
      const targetFolder = this.getFile(targetFolderId);
      if (!this.isFolder(targetFolder!)) return;
      this.filterId(draggedDirectoryId, this.setFiles);

      setData("", "");
      return await this.dragIntoFolder(
        targetFolderId,
        draggedDirectoryId,
        draggedIsFolder,
      );
    };
    this.createFolderStructure = async (
      zip,
      files,
      userId,
      parentPath = "",
    ) => {
      const promises: Promise<any>[] = [];

      files.forEach(async (file) => {
        const res: any = await this.getSingleFileBlob(file, userId);
        const reader = new FileReader();
        reader.readAsText(res);
        reader.onload = async (e) => {
          const itemPath = pathy.join(parentPath, file.name);
          if (file.type === "folder") {
            const subFiles = await this.loadFiles({
              loadPathOrFileId: file?.id,
              getResult: true,
            });
            if (!subFiles) return;
            promises.push(
              this.createFolderStructure(zip, subFiles, userId, itemPath),
            );
          } else {
            zip.addFile(itemPath, e.target?.result);
          }
        };
        promises.push(res);
      });

      return Promise.resolve(promises);
    };
    this.downloadFolder = async (pathOrFileId, fileName) => {
      // const zip = new AdmZip();

      try {
        await this.uploadProgress(
          this.loadFiles({ loadPathOrFileId: pathOrFileId, getResult: true })
            .then((files) =>
              Promise.all([
                // this.createFolderStructure(zip, files, userId, fileName),
                new Promise((resolve) => setTimeout(resolve, 5000)),
              ]),
            )
            .then(() => {
              // const zipContent = zip.toBuffer();
              // FileSaver.saveAs(new Blob([zipContent]), `${fileName}.zip`);
            }),
        );
      } catch (e) {
        this.setUploadStepToNull();
      }
    };
    this.getFileId = (str) => {
      const lastSlashIndex = str.lastIndexOf("/");
      const secondLastSlashIndex = str.lastIndexOf("/", lastSlashIndex - 1);
      if (secondLastSlashIndex !== -1) {
        return str.substring(secondLastSlashIndex + 1, lastSlashIndex);
      } else {
        return str.replace("/", "");
      }
    };
    this.filterId = (fileId, setFiles) => {
      setFiles(this.currentFiles.filter((file) => file.id !== fileId));
    };
    this.getFile = (fileId) => {
      for (const file of this.currentFiles) {
        if (file.id === fileId) {
          return file;
        }
      }
    };
    this.checkDirectoryExistsAlready = (folderName: string) => {
      for (const file of this.currentFiles) {
        if (file.name === folderName) {
          return file;
        }
      }
    };
    this.getParentPath = (str) => {
      if (str.split("/").length <= 2) {
        return "";
      }
      const lastIndex = str.lastIndexOf("/");
      const secondLastIndex = str.lastIndexOf("/", lastIndex - 1);
      return str.slice(0, secondLastIndex + 1);
    };
    this.setUploadStepToNull = async () => {
      this.setUploadStep!(null);
    };
    this.uploadStepTimeout = async () => {
      for (let i = 1; i < 7; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        this.setUploadStep!(i);
      }
    };
    this.uploadProgress = async (arg) => {
      await Promise.all([this.uploadStepTimeout(), arg]);
      this.setUploadStepToNull();
    };
    this.isFolder = (file: DownloadFileType) => {
      if (file === undefined) return false;
      return file.type === "folder";
    };
  }
  /** Helper functions*/
  public getFileId: (str: string) => string;
  public getFile: (fileId: string) => DownloadFileType | undefined;
  public getParentPath: (str: string) => string;
  public filterId: (fileId, setFiles) => void;
  public setUploadStepToNull: () => void;
  public uploadStepTimeout: () => void;
  public isFolder: (file: DownloadFileType) => boolean;
  public uploadProgress: (arg) => Promise<void>;

  /** Abstract functions */

  abstract getSingleFileBlob: GetSingleFileBlob;
  abstract loadFiles: LoadFiles;
  abstract downloadFile: DownloadFile;
  abstract getDownloadLink: GetDownloadLink;
  abstract uploadFileToDrive: UploadFileToDrive;
  abstract createNewFolder: CreateNewFolder;
  abstract deleteFileOrFolder: DeleteDirectory;
  public deleteMultipleFilesAndFolders: DeleteMultipleDirectories;
  public runDragIntoFolder: (
    targetFolderId: string,
    draggedDirectoryId: string,
    files: any[],
  ) => Promise<void>;
  abstract dragIntoFolder: DragIntoFolder;
  abstract renameFileOrFolder: Rename;
}
export type GetSingleFileBlob = (
  file: any,
  userId: string,
) => Promise<Blob | undefined>;
export type CreateFolderStructure = (
  zip,
  files,
  userId,
  parentPath?: string,
) => Promise<Promise<any>[]>;
export type LoadFilesInput = {
  loadPathOrFileId: string;
  getResult?: boolean;
  nextPageToken?: string;
};
export type LoadFiles = (
  args: LoadFilesInput,
) => Promise<DownloadFileType[] | undefined>;
export type DownloadFile = (fileId: string) => void;
export type DownloadFolder = (pathOrFileId, fileName) => Promise<void>;
export type GetDownloadLink = (file: DownloadFileType) => Promise<string>;
export type UploadFileToDrive = (
  file: any,
  folderName?: string,
  fileName?: string,
  fileType?: string,
) => void;
export type CreateNewFolder = (folderName: string) => void;
export type DeleteDirectory = (file: DownloadFileType) => Promise<any>;
export type DeleteMultipleDirectories = (files: DownloadFileType[]) => void;
export type DragIntoFolder = (
  targetFolderId: string,
  draggedDirectoryId: string,
  draggedIsFolder: boolean,
) => Promise<void>;
export type Rename = (
  fileId: string,
  oldName: string,
  newName: string,
  fileType: string,
) => Promise<void>;
