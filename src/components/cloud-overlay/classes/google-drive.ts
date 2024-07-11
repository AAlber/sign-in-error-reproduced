import cookie from "react-cookies";
import type { DownloadFileType } from "@/src/client-functions/client-firebase";
import type {
  CreateNewFolder,
  DeleteDirectory,
  DownloadFile,
  DragIntoFolder,
  GetDownloadLink,
  LoadFiles,
  LoadFilesInput,
  Rename,
  UploadFileToDrive,
} from "./drive";
import { Drive } from "./drive";

export class GoogleDrive extends Drive {
  id = 1;
  getSingleFileBlob: (item: any) => Promise<any>;
  downloadFile: DownloadFile;
  getDownloadLink: GetDownloadLink;
  uploadFileToDrive: UploadFileToDrive;
  createNewFolder: CreateNewFolder;
  deleteFileOrFolder: DeleteDirectory;
  dragIntoFolder: DragIntoFolder;
  renameFileOrFolder: Rename;
  loadFiles: LoadFiles;
  bearerToken: () => Promise<string>;
  tokenValidation: (setIsValid: (isValid: boolean) => void) => Promise<void>;

  googleBaseURL: string;
  GOOGLE_SCOPES =
    "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly";
  constructor(
    userId: string,
    currentFiles: any,
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
      const { loadPathOrFileId, getResult } = args;
      if (!this.setLoaded || !this.setFiles) return;
      try {
        const response = await fetch("/api/google", {
          method: "POST",
          body: JSON.stringify({
            fileId: loadPathOrFileId,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const results = await response.json();
        const shouldReturnFiles = getResult === true;
        if (!shouldReturnFiles) {
          if (results?.code === 200) {
            !getResult && this.setFiles && this.setFiles(results.data?.files);
          } else {
            this.setFiles([]);
          }
        }
        return results?.data?.files || [];
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
        this.setFiles([]);
        this.setLoaded(true);
      }
    };
    this.tokenValidation = async (setGoogleIsValid) => {
      const url = `${this.googleBaseURL}/oauth2/v1/tokeninfo?access_token`;

      fetch(`${url}=${await cookie.load("google_access_token")}`)
        .then((res) =>
          res?.status === 200
            ? setGoogleIsValid(true)
            : setGoogleIsValid(false),
        )
        .catch(() => setGoogleIsValid(false));
    };
    this.bearerToken = async () =>
      `Bearer ${await cookie.load("google_access_token")}`;

    this.getSingleFileBlob = async (file: any) => {
      const bearer = await this.bearerToken();
      try {
        const response = await fetch(
          `${this.googleBaseURL}/drive/v2/files/${file?.id}?alt=media&source=${file?.source}`,
          {
            method: "GET",
            headers: {
              Authorization: bearer,
              "Content-Type": "application/octet-stream",
            },
          },
        );

        const results = await response.blob();
        return results;
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
      }
    };

    this.googleBaseURL = `https://www.googleapis.com`;

    this.downloadFile = async (fileId: string) => {
      const link = document.createElement("a");

      const findFile = this.currentFiles.filter((item) => item?.id === fileId);
      const file = findFile[0];
      const isGoogleFile =
        file.type.toLowerCase() === ("docs" || "sheets" || "slides");
      if (!file) return;

      let href = file?.source ? file.source : "";
      if (isGoogleFile) {
        href = file.source;
      }
      if (!isGoogleFile) {
        link.setAttribute("download", file?.name);
      }
      link.href = href;

      document.body.appendChild(link);

      link.click();
      link.remove();
    };

    this.getDownloadLink = (file: DownloadFileType) => {
      return Promise.resolve(file.source ? file.source : "");
    };

    this.uploadFileToDrive = async (
      file,
      folderName?,
      fileName?,
      fileType?,
    ) => {
      const type = fileType ? fileType : file.type;
      const url = process.env.NEXT_PUBLIC_GOOGLE_UPLOAD;
      let metadata: any = {
        name: fileName ? fileName : file?.name,
        mimeType: type,
      };
      const fileId = this.getFileId(this.path.toString());
      if (fileId) {
        metadata = {
          ...metadata,
          parents: [await this.getFileId(this.path.toString())],
        };
      }

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      );
      form.append("file", file);

      try {
        this.uploadProgress(
          fetch(`${url}?uploadType=multipart`, {
            body: form,
            method: "POST",
            headers: {
              Authorization: await this.bearerToken(),
            },
          }).then(
            async () => await this.loadFiles({ loadPathOrFileId: fileId }),
          ),
        );
      } catch (e) {
        this.setUploadStepToNull();
        const error = e as Error;
        console.log(error.message);
      }
    };

    this.createNewFolder = async (folderName: string) => {
      const url = process.env.NEXT_PUBLIC_GOOGLE_UPLOAD;

      let metadata: any = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };

      const fileId = await this.getFileId(this.path);
      if (fileId) {
        metadata = { ...metadata, parents: [fileId] };
      }

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      );

      try {
        this.uploadProgress(
          fetch(`${url}?uploadType=multipart`, {
            body: form,
            method: "POST",
            headers: {
              Authorization: await this.bearerToken(),
            },
          }).then(
            async () => await this.loadFiles({ loadPathOrFileId: fileId }),
          ),
        );
      } catch (e) {
        this.setUploadStepToNull();
        const error = e as Error;
        console.log(error.message);
      }
    };

    this.deleteFileOrFolder = async (file: DownloadFileType) => {
      const url = `${this.googleBaseURL}/drive/v2/files/${file.id}`;

      try {
        await this.uploadProgress(
          fetch(url, {
            method: "DELETE",
            headers: {
              Authorization: await this.bearerToken(),
            },
          }).then(
            async () =>
              await this.loadFiles({
                loadPathOrFileId: this.getFileId(this.path),
              }),
          ),
        );
      } catch (e) {
        this.setUploadStepToNull();
        const error = e as Error;
        console.log(error.message);
      }
    };

    this.dragIntoFolder = async (
      targetFolderId: string,
      draggedDirectoryId: string,
    ) => {
      const url = `${this.googleBaseURL}/drive/v2/files/${draggedDirectoryId}?addParents=${targetFolderId}`;
      try {
        await this.uploadProgress(
          fetch(url, {
            method: "PATCH",
            headers: {
              Authorization: await this.bearerToken(),
            },
          }).then(async () =>
            this.loadFiles({ loadPathOrFileId: this.getFileId(this.path) }),
          ),
        );
      } catch (e) {
        this.setUploadStepToNull();
        const error = e as Error;
        console.log(error.message);
      }
    };

    this.renameFileOrFolder = async (
      fileId: string,
      oldName: string,
      newName: string,
    ) => {
      const url = `${this.googleBaseURL}/drive/v2/files/${fileId}`;

      try {
        this.uploadProgress(
          fetch(url, {
            method: "PATCH",
            body: JSON.stringify({
              title: newName,
            }),
            headers: {
              Authorization: await this.bearerToken(),
              "Content-Type": "application/json",
            },
          }).then(
            async () =>
              await this.loadFiles({
                loadPathOrFileId: this.getFileId(this.path),
              }),
          ),
        );
      } catch (e) {
        this.setUploadStepToNull();
        const error = e as Error;
        console.log(error.message);
      }
    };
  }
}
export const googleTokenValidation = async (setGoogleIsValid) => {
  const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token`;

  fetch(`${url}=${await cookie.load("google_access_token")}`)
    .then((res) => {
      res?.status === 200 ? setGoogleIsValid(true) : setGoogleIsValid(false);
    })
    .catch(() => setGoogleIsValid(false));
};
