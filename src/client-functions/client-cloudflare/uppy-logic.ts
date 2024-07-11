import type { AwsS3UploadParameters } from "@uppy/aws-s3";
import AwsS3 from "@uppy/aws-s3";
import type { FileProgress, UploadResult, UppyFile } from "@uppy/core";
import { Uppy } from "@uppy/core";
import German from "@uppy/locales/lib/de_DE";
import English from "@uppy/locales/lib/en_US";
import useContentBlockOverview from "@/src/components/course/content-blocks/block-overview/zustand";
import useCourse from "@/src/components/course/zustand";
import { useCourseDrive, useUserDrive } from "@/src/components/drive/zustand";
import type { UploaderData } from "@/src/components/reusable/file-uploaders/zustand";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { createUploadPath } from "@/src/server/functions/server-cloudflare/path-generation";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import type {
  DeleteMultipleDirectoriesData,
  FileUploadPathData,
  UploadPathDataWithFile,
} from "@/src/types/storage.types";
import {
  filterUndefined,
  getLastDuplicates,
  getMaxFileSizeInfo,
  maxFileSizes,
  supportedFileTypesForAI,
  supportedFileTypesForFileViewer,
} from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { courseDrive } from "../client-drive/drive-builder";
import { deleteCloudflareDirectories } from ".";
import {
  getDecodedFileNameFromUrl,
  getDownloadUrlsFromUploadResult,
  storageLimitErrors,
} from "./utils";

export const removeDuplicateFileNamesInUppy = (
  file: UppyFile,
  alreadyCheckedFileNames: Set<string>,
) => {
  const { uppy } = useFileDrop.getState();
  const lastDuplicates = getLastDuplicates(
    uppy?.getFiles() || [],
    "name",
    file.name,
  );
  alreadyCheckedFileNames.add(file.name);
  if (lastDuplicates) {
    lastDuplicates.forEach((file) => {
      uppy?.removeFile(file.id);
    });
    duplicateFileNameErrorToast(file.name);
  }
};

export const duplicateFileNameErrorToast = (fileName: string) => {
  toast.error("duplicate_file_name", {
    description: "duplicate_file_name_description",
    descriptionVariables: [fileName],
  });
};

export const removeDuplicateFileNameInFileBlockEditor = (file: UppyFile) => {
  const { open, block } = useContentBlockOverview.getState();
  const { uppy } = useFileDrop.getState();
  if (block?.status === "DRAFT" && open && block.type === "File") {
    for (const fileUrl of block.specs.files) {
      if (getDecodedFileNameFromUrl(fileUrl) === file.name) {
        uppy?.removeFile(file.id);
        duplicateFileNameErrorToast(file.name);
      }
    }
  }
};

export const removeTooLargeFiles = (file: UppyFile, maxFileSize: number) => {
  const { uppy } = useFileDrop.getState();
  if (file.size > maxFileSize) {
    uppy?.removeFile(file.id);
    const { size } = getMaxFileSizeInfo(maxFileSize);
    toast.error("file_too_large", {
      description: "file_too_large-description",
      descriptionVariables: [size],
    });
  }
};

export const handleUploadFinish = ({
  result,
  maxFileAmount = 1,
  uploadPathData,
  onUploadFinish,
  onUploadCompleted,
  sizeUpdater,
}: {
  result: UploadResult;
  maxFileAmount?: number;
  uploadPathData: UploaderData["uploadPathData"];
  onUploadFinish?: (result: UploadResult) => void;
  onUploadCompleted?:
    | ((url: string) => void)
    | ((urls: string[]) => void)
    | undefined;
  sizeUpdater?: (result: UploadResult) => void;
}) => {
  const urls = getDownloadUrlsFromUploadResult(result).filter(filterUndefined);
  deleteFailedUploads(result, uploadPathData);
  if (!urls || urls.length === 0 || !urls[0]) return;
  if (sizeUpdater) sizeUpdater(result);

  if (onUploadCompleted !== undefined) {
    if (maxFileAmount === 1) onUploadCompleted(urls[0] as any);
    else onUploadCompleted(urls as any);
  }
  if (onUploadFinish !== undefined) {
    onUploadFinish(result);
  }
};

export const deleteFailedUploads = async (
  result: UploadResult,
  uploadPathData: UploaderData["uploadPathData"],
) => {
  if (result.failed.length > 0) {
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/onboarding/process"
    ) {
      return;
    }
    const deleteData: DeleteMultipleDirectoriesData = [];
    result.failed.forEach((file) => {
      const data: {
        institutionId: string;
        userId: string;
        data: UploadPathDataWithFile;
      } = {
        data: {
          ...uploadPathData,
          fileName: file.name,
          size: file.size,
          order: 0,
          contentType: file.type ? file.type : "application/octet-stream",
        },
        institutionId: "",
        userId: "",
      };
      const path = createUploadPath(data);
      if (!path) return;
      deleteData.push({
        url: path,
        isFolder: false,
      });
    });
    deleteCloudflareDirectories(deleteData);
    //will delete the failed uploads in our backend
  }
};

export const handleUploadProgres = (file: UppyFile, progress: FileProgress) => {
  const { setUploadingFiles, uploadingFiles } = useFileDrop.getState();
  const percentProgress = (progress.bytesUploaded / progress.bytesTotal) * 100;
  const filesCopy = [...uploadingFiles];
  const currentFile = filesCopy.find((f) => f.file.id === file.id);
  if (currentFile) {
    const newFile = { ...currentFile, progress: percentProgress };
    const newArray = filesCopy.filter((f) => f.file.id !== file.id);
    setUploadingFiles([
      ...newArray,
      ...(percentProgress !== 100 ? [{ ...newFile }] : []),
    ]);
  } else {
    if (percentProgress !== 100) {
      setUploadingFiles([
        ...uploadingFiles,
        { file: file, progress: percentProgress },
      ]);
    }
  }
};

export const handleFileBeingAdded = (maxFileSize: number, uppy: Uppy) => {
  const { setFileLength } = useFileDrop.getState();
  const alreadyCheckedFileNames = new Set<string>();
  if (!uppy) throw new Error("Uppy not initialized");
  for (const file of uppy?.getFiles()) {
    if (!alreadyCheckedFileNames.has(file.name)) {
      removeDuplicateFileNamesInUppy(file, alreadyCheckedFileNames);
      removeDuplicateFileNameInFileBlockEditor(file);
    }
    removeTooLargeFiles(file, maxFileSize);
  }
  setFileLength(uppy.getFiles().length);
};

export const handleUploadSuccess = (file: UppyFile) => {
  const { setUploadingFiles, uploadingFiles } = useFileDrop.getState();
  const filesCopy = [...uploadingFiles];
  const currentFile = filesCopy.find((f) => f.file.id === file.id);
  if (currentFile) {
    setUploadingFiles([...filesCopy.filter((f) => f.file.id !== file.id)]);
  }
};

export function initializeFileUploader({
  uploadPathData,
  allowedFileTypes,
  autoProceed = false,
  maxFileAmount = 1,
  maxFileSize = maxFileSizes.fallback,
  minFileAmount = 1,
  onUploadFinish,
  onUploadCompleted,
  sizeUpdater,
}: Partial<UploaderData>): Uppy {
  const { setFileLength } = useFileDrop.getState();
  if (!uploadPathData) throw new Error("uploadPathData is undefined");

  const uppy = new Uppy({
    autoProceed,
    locale: getUppyLocale(),
    restrictions: {
      maxNumberOfFiles: maxFileAmount,
      minNumberOfFiles: minFileAmount,
      ...(allowedFileTypes && { allowedFileTypes }),
    },
  }).use(AwsS3, {
    id: "AwsS3",
    getUploadParameters: (file: UppyFile) =>
      getUploadParameters(file, uppy, uploadPathData),
  });

  uppy.on("file-added", () => {
    handleFileBeingAdded(maxFileSize, uppy);
  });

  uppy.on("upload-progress", (file: UppyFile, progress: FileProgress) => {
    handleUploadProgres(file, progress);
  });
  uppy.on("upload-success", (file) => {
    handleUploadSuccess(file);
  });

  uppy.on("file-removed", () => setFileLength(uppy.getFiles().length));

  (onUploadFinish || onUploadCompleted || sizeUpdater) &&
    uppy.on("complete", (result) => {
      const { setUploadingFiles } = useFileDrop.getState();
      setUploadingFiles([]);
      handleUploadFinish({
        result,
        uploadPathData,
        maxFileAmount,
        onUploadFinish,
        onUploadCompleted,
        sizeUpdater,
      });
    });

  return uppy;
}

export function getAllowedFileTypesForRegisteredBlock(
  block: RegisteredContentBlock,
  isProtected?: boolean,
) {
  if (isProtected) return supportedFileTypesForFileViewer;
  switch (block.type) {
    case "ProtectedFile":
      return supportedFileTypesForFileViewer;
    case "DocuChat":
      return supportedFileTypesForAI;
    case "Audio":
      return ["audio/*"];
    case "AutoLesson":
      return supportedFileTypesForAI;
    default:
      return undefined;
  }
}

export const getUppyLocale = () => {
  const { user } = useUser.getState();
  return user.language === "de" ? German : English;
};

export async function initializeBlockUploader(
  blockId: string,
  block: RegisteredContentBlock,
  isProtected?: boolean,
) {
  const { setUppy } = useFileDrop.getState();
  const { course } = useCourse.getState();
  const allowedFileTypes = getAllowedFileTypesForRegisteredBlock(
    block,
    isProtected,
  );
  // This is how docu-chat, protected file and file content block
  // uploaders are initialized.
  const uppy = initializeFileUploader({
    uploadPathData: {
      type: "block",
      blockId,
      layerId: course?.layer_id,
    },
    maxFileAmount:
      block.type === "DocuChat" || block.type === "AutoLesson" ? 1 : 100,
    maxFileSize: maxFileSizes.files,
    allowedFileTypes,
  });
  setUppy(uppy);
}

export const uploadContentBlockFiles = async () => {
  const { uppy } = useFileDrop.getState();
  if (uppy) {
    const result = await uppy?.upload();
    const urls = updateCourseStorageCategoryWithUploadResult(result);
    return urls;
  }
  return undefined;
};

export const updateCourseStorageCategoryWithUploadResult = (
  result: UploadResult,
) => {
  const totalSize = result?.successful.reduce(
    (acc, file) => acc + file.size,
    0,
  );
  if (totalSize) {
    courseDrive.client.update.storageCategory({
      categoryTitle: "content_block_files",
      newValue:
        (courseDrive.client.get.storageCategorySize("content_block_files") ||
          0) + totalSize,
    });
  }
  const urls = getDownloadUrlsFromUploadResult(result).filter(filterUndefined);
  if (!urls || urls.length === 0)
    throw new Error("Error uploading file for content block");
  return urls;
};

export async function getUploadParameters(
  file: UppyFile,
  uppy: Uppy,
  uploadPathData: FileUploadPathData,
) {
  if (uploadPathData.type === undefined)
    throw new Error("Storage handler data is undefined");
  let totalSize = 0;
  uppy.getFiles().forEach((file) => {
    totalSize += file.size;
  });
  const uploadData = {
    ...uploadPathData,
    fileName: file.name,
    size: file.size,
    contentType: file.type ? file.type : "application/octet-stream",
  };

  const response = await fetch(api.uploadFile, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify(uploadData),
  });
  const { user } = useUser.getState();
  const key = createUploadPath({
    data: uploadData as UploadPathDataWithFile,
    institutionId: user.currentInstitutionId,
    userId: user.id,
  });
  if (!response || !response.ok) {
    if (uploadData.type === "course-drive") {
      const { setR2Objects, r2Objects } = useCourseDrive.getState();
      const newObjects = r2Objects.filter((r2Object) => r2Object.Key !== key);
      setR2Objects(newObjects);
    } else if (uploadData.type === "user-drive") {
      const { setR2Objects, r2Objects } = useUserDrive.getState();
      const newObjects = r2Objects.filter((r2Object) => r2Object.Key !== key);
      setR2Objects(newObjects);
    }
    const res = await response?.json();
    if (res.message && storageLimitErrors.includes(res.message)) {
      dealWithStorageLimitErrors(res);
    } else {
      console.log("istoasting");
      toast.error("upload_failed", {
        description: "upload_failed_description",
      });
    }
    throw new Error("Failed to get upload parameters");
  }

  const data: { url: string; method: "PUT" } = await response.json();

  const object: AwsS3UploadParameters = {
    method: data.method,
    url: data.url,
    fields: {}, // For presigned PUT uploads, this should be left empty.
    // Provide content type header required by S3
    headers: {
      "Content-Type": file.type ? file.type : "application/octet-stream",
    },
  };
  return object;
}

export const dealWithStorageLimitErrors = (res: any) => {
  if (res.message && storageLimitErrors.includes(res.message)) {
    toast.warning(res.message, {
      description: res.message + "-description",
      descriptionVariables: [res.limit],
    });
  }
};
