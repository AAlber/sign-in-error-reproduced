import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { filterOutFirebaseFiles } from "@/src/server/functions/server-cloudflare/utils";
import type { ContentBlock } from "@/src/types/course.types";
import type {
  DeleteMultipleDirectoriesData,
  FileUploadPathData,
  ListDirectoryReturnData,
  UploadPathType,
  UppyFailedUploadFile,
  UppyUploadedFile,
} from "@/src/types/storage.types";
import useUser from "@/src/zustand/user";
import { getDownloadUrlFromUploadUrl, toastFailedFile } from "./utils";

export async function uploadMultipleFilesFromDropfield({
  onSuccess,
  onFail,
}: {
  onSuccess: (successFullFile: UppyUploadedFile[]) => any;
  onFail?: (failedFile: UppyFailedUploadFile) => any;
}) {
  const { uppy } = useFileDrop.getState();
  if (!uppy) throw new Error("Uppy not initialized");
  const result = await uppy.upload();
  if (result.failed.length > 0 && result.failed[0]) {
    result.failed.forEach((file) =>
      onFail ? onFail(file) : toastFailedFile(file),
    );
  }
  if (result.successful.length > 0 && result.successful[0]) {
    return onSuccess(result.successful);
  }
}

export async function fetchDropFieldDownloadUrls() {
  return await uploadMultipleFilesFromDropfield({
    onSuccess: async (successfulFiles: UppyUploadedFile[]) => {
      const map = successfulFiles.map((file) => {
        return getDownloadUrlFromUploadUrl(file.uploadURL);
      });
      return map;
    },
  });
}

export async function downloadCloudflareFile(url: string) {
  const response = await fetch(
    api.downloadFile + "?url=" + encodeURIComponent(url),
    {
      method: "GET",
      headers: {
        "X-CF-Secret": process.env.R2_AUTH_KEY_SECRET as string,
      },
    },
  );
  if (!response.ok) throw new Error("Unsuccessful request");
  return response;
}

export const deleteCloudflareDirectories = async (
  data: DeleteMultipleDirectoriesData,
  showToast = true,
) => {
  const filteredData = filterOutFirebaseFiles(data);
  const response = await fetch(api.deleteFile, {
    method: "DELETE",
    body: JSON.stringify(filteredData),
  });
  if (!response.ok && showToast) {
    toast.error("file_deletion_failed", {
      description: "file_deletion_failed_description",
    });
    return response;
  } else return response;
};

export const createFileUrl = ({
  blockId,
  layerId,
  institutionId,
  storageType,
}: {
  blockId: string;
  layerId: string;
  institutionId: string;
  storageType: Extract<UploadPathType, "handIn" | "workbench" | "block">;
}) => {
  return (
    process.env.NEXT_PUBLIC_WORKER_URL +
    "/institutions/" +
    institutionId +
    "/layer/" +
    layerId +
    "/" +
    storageType +
    "/" +
    blockId
  );
};

export const deleteHandinFiles = async ({
  blockId,
  layerId,
}: {
  blockId: string;
  layerId: string;
}) => {
  const { user } = useUser.getState();
  return await deleteCloudflareDirectories([
    {
      url: createFileUrl({
        blockId,
        layerId,
        institutionId: user.currentInstitutionId,
        storageType: "handIn",
      }),
      isFolder: true,
    },
  ]);
};

export const deleteWorkbenchFiles = async ({
  blockId,
  layerId,
}: {
  blockId: string;
  layerId: string;
}) => {
  const { user } = useUser.getState();
  return await deleteCloudflareDirectories([
    {
      url: createFileUrl({
        blockId,
        layerId,
        institutionId: user.currentInstitutionId,
        storageType: "workbench",
      }),
      isFolder: true,
    },
  ]);
};

export const deleteContentBlockFiles = async ({
  block,
  blockId,
}: {
  block?: ContentBlock;
  blockId: string;
}) => {
  if (block?.specs.fileUrl) {
    await deleteCloudflareDirectories([
      {
        url: block.specs.fileUrl,
        isFolder: false,
      },
    ]);
  }
  if (block?.specs.files) {
    await deleteCloudflareDirectories(
      block.specs.files.map((file) => ({
        url: file,
        isFolder: false,
      })),
    );
  }

  if (block?.type === "HandIn") {
    await deleteHandinFiles({ blockId, layerId: block.layerId });
  }
  if (
    block?.type === "Assessment" ||
    block?.type === "StaticWorkbenchFile" ||
    block?.type === "EditorFile"
  ) {
    await deleteWorkbenchFiles({ blockId, layerId: block.layerId });
  }
};

export const getInstitutionStorageOverview = async () => {
  const res = await fetch(api.getInstitutionStorageOverview, {
    method: "GET",
  });
  return res.json();
};

export const listFilesInDirectory = async (
  data: FileUploadPathData,
): Promise<ListDirectoryReturnData> => {
  const res = await fetch(
    api.listFilesInDirectory + "?data=" + JSON.stringify(data),
  );

  if (!res.ok) {
    toast.error("file_listing_failed", {
      description: "file_listing_failed_description",
    });
    return {
      r2Objects: [],
      storageCategories: [],
    };
  }
  return (await res.json()) as ListDirectoryReturnData;
};
