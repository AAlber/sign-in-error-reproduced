import type { UploadResult } from "@uppy/core";
import { getFilenameFromUrl } from "pdfjs-dist";
import { toast } from "@/src/components/reusable/toaster/toast";
import type {
  FolderNameResult,
  LimitReachedError,
  NewMoveFilesData,
  TransferType,
  UppyFailedUploadFile,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";

export const getDownloadUrlsFromUploadResult = (result: UploadResult) => {
  const res = result.successful.map((file) => {
    const url = file.uploadURL;
    if (!url) return;
    const fetchUrl = getDownloadUrlFromUploadUrl(url);
    return fetchUrl;
  });
  return res;
};

export const toastFailedFile = (file: UppyFailedUploadFile) => {
  toast.error("upload_failed", {
    description: file.error,
  });
};

export const getDownloadUrlFromUploadUrl = (url: string) => {
  const fetchUrl = url?.replace(
    process.env.NEXT_PUBLIC_R2_BUCKET_URL as string,
    "https://" + process.env.NEXT_PUBLIC_R2_WORKER_NAME + ".alber.workers.dev",
  );
  return fetchUrl;
};

export function getFileName(url?: string): string | undefined {
  if (!url) return undefined;
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export function getStringBeforeLastSlash(str: string) {
  const parts = str.split("/");
  return parts.slice(0, -1).join("/");
}

export const reverseMoveFileData = (data: NewMoveFilesData[]) => {
  return data.map(({ sourceKey, destinationKey }) => {
    return {
      sourceKey: destinationKey,
      destinationKey: sourceKey,
      deleteSourceKey: true,
    };
  });
};

export function removeLastSegment(path: string): string {
  // Split the string into segments
  const segments = path.split("/");

  // Remove the last segment. Note that if the path ends with a '/',
  // the last segment will be an empty string, so we remove the second to last segment in that case.
  if (segments.length > 0 && segments[segments.length - 1] === "") {
    segments.pop(); // Remove the last empty segment due to trailing '/'
  }

  // Remove the now last segment, which is the actual last word before the trailing '/'
  segments.pop();

  // Join the segments back together and ensure it ends with a '/'
  return segments.length > 0 ? `${segments.join("/")}` : "";
}
export function getDecodedFileNameFromUrl(url: string): string {
  const fileName = getFilenameFromUrl(url);
  return decodeURIComponent(fileName) as string;
}

export const proxyCloudflareReadRequest = async (
  url: string,
): Promise<string> => {
  if (url.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!)) {
    const res = await fetch(
      `/api/cloudflare/download?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
      },
    );
    const result = await res.json();
    if (!res.ok) {
      toast.error("download_failed", {
        description: "download_failed_description",
      });
      result;
      log.error("Error fetching the Blob:", JSON.stringify(result)).cli();
      return "";
    }

    const { signedUrl } = result;

    return signedUrl;
  }
  return url;
};

export const determineDriveTransferType: (
  data: NewMoveFilesData[],
) => TransferType | undefined = (data: NewMoveFilesData[]) => {
  const pathIdsToBeCopied = data
    .map((path) => path.sourceKey)
    .filter(filterUndefined);
  if (!data[0]) throw new Error("No data found");
  if (!checkCommonBase(pathIdsToBeCopied, 5)) {
    return "base-path-mismatch";
  }
  const destinationKey = data[0].destinationKey;
  const destination = destinationKey?.split("/")[4];
  const origin = data[0].sourceKey.split("/")[4];

  if (destination === origin && destination === "course-drive") {
    if (!checkCommonBase([...pathIdsToBeCopied, destinationKey], 5)) {
      return "course-drive-to-course-drive";
    }
    return "course-drive";
  } else if (destination === origin && destination === "user-drive") {
    if (!checkCommonBase([...pathIdsToBeCopied, destinationKey], 5)) {
      return "base-path-mismatch";
    }
    return "user-drive";
  } else if (destination === "user-drive" && origin === "course-drive") {
    return "course-drive-to-user";
  } else if (destination === "course-drive" && origin === "user-drive") {
    return "user-to-course-drive";
  }
};

export const getKeyFromUrl = (url: string) => {
  let urlNew = url.replace(process.env.NEXT_PUBLIC_WORKER_URL! + "/", "");
  urlNew = urlNew.replace(process.env.NEXT_PUBLIC_R2_BUCKET_URL! + "/", "");
  return urlNew;
};

export function checkCommonBase(paths: string[], index: number): boolean {
  // Split each path into its components.
  const splitPaths = paths.map((path) => path.split("/"));

  // Iterate over each path up to the specified index.
  for (let i = 0; i < index; i++) {
    // Get the ith segment of the first path as the reference.
    const reference = splitPaths[0]![i];

    // Compare the ith segment of each path with the reference.
    for (const path of splitPaths) {
      if (path[i] !== reference) {
        // If any segment doesn't match the reference, the common base check fails.
        return false;
      }
    }
  }

  // If all segments match up to the specified index, the paths share a common base.
  return true;
}

export const getBasicDirectoryInfo = (
  fullUrl: string,
  subUrlPartial: string,
): FolderNameResult => {
  if (!subUrlPartial.endsWith("/")) {
    subUrlPartial += "/";
  }
  const startPosition = fullUrl.indexOf(subUrlPartial);
  if (startPosition === -1) {
    log
      .error(
        "Error getting directory name",
        JSON.stringify({ fullUrl, subUrlPartial }),
      )
      .cli();
    return { directoryName: "Temporary File Error", isFolder: false };
  }
  const adjustedStart = startPosition + subUrlPartial.length;
  const remainingPath = fullUrl.substring(adjustedStart);
  const nextPart = remainingPath.split("/", 1)[0];
  const isFolder = remainingPath.includes("/");

  return {
    directoryName: nextPart || remainingPath,
    isFolder: isFolder,
  };
};

export const storageLimitErrors = [
  "course-limit-reached",
  "user-limit-reached",
  "organization-limit-reached",
  "file_too_large",
];
export const mimeTypeToHumanReadable = (mimeType: string) => {
  const mimeTypeMap: { [key: string]: string } = {
    "application/msword": "Microsoft Word document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word document",
    "application/pdf": "PDF document",
    "application/vnd.ms-excel": "Excel Sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel Sheet",
    "application/vnd.ms-powerpoint": "PowerPoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "Powerpoint",
    "image/jpeg": "JPEG image",
    "image/png": "PNG image",
    "image/gif": "GIF image",
    "text/plain": "Text file",
    "text/html": "HTML document",
    "application/zip": "ZIP archive",
    "application/x-rar-compressed": "RAR archive",
    "video/mp4": "MP4 video",
    "audio/mpeg": "MP3 audio",
  };

  return mimeTypeMap[mimeType] || mimeType;
};

export function isLimitReachedError(error: any): error is LimitReachedError {
  return error && storageLimitErrors.includes(error.message);
}
