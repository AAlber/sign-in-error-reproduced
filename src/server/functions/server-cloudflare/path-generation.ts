import cuid from "cuid";
import type {
  FileUploadPathData,
  UploadPathDataWithFile,
  UploadPathType,
} from "@/src/types/storage.types";

export const createUploadPath = ({
  data,
  institutionId,
  userId,
}: {
  data: UploadPathDataWithFile;
  institutionId?: string | null;
  userId: string | null;
}) => {
  if (!institutionId && data.type !== "public" && data.type !== "logo")
    throw new Error("No institutionId provided");
  let path = `institutions/${institutionId}/`;
  const { fileName } = data;
  const id = cuid();
  const subPathString =
    "subPath" in data && data.subPath ? data.subPath + "/" : "";

  switch (data.type) {
    case "logo":
      return `logos/${id}/logo.webp`;
    case "public":
      return `public/${subPathString}${data.fileName}`;
    case "user-drive":
      return (path += `user/${userId}/user-drive/${subPathString}${fileName}`);
    case "user-documents":
      return (path += `user/${data.userId}/user-documents/${subPathString}${fileName}`);
    case "block":
      return (path += `layer/${data.layerId}/${data.type}/${data.blockId}/${fileName}`);
    case "handIn":
      return (path += `layer/${data.layerId}/${data.type}/${data.blockId}/${userId}/${fileName}`);
    case "workbench":
      return (path += `layer/${data.layerId}/${data.type}/${data.blockId}/${data.elementId}/${fileName}`);
    case "course-drive":
      return (path += `layer/${data.layerId}/${data.type}/${subPathString}${fileName}`);
    case "layer":
      return (path += `layer/${data.layerId}/${subPathString}${fileName}`);
    case "institution":
      return (path += `${subPathString}${fileName}`);
  }
};

export const createStorageSizePath = ({
  data,
  institutionId,
  userId,
}: {
  data: UploadPathDataWithFile;
  institutionId?: string;
  userId: string | null;
}) => {
  const institutionPath = `institutions/${institutionId}/`;
  let subPath: string | undefined = undefined;
  console.log("data", data);
  switch (data.type) {
    case "user-drive":
      subPath = institutionPath + `user/${userId}/user-drive`;
      break;
    case "course-drive":
    case "layer":
    case "block":
    case "handIn":
    case "workbench":
      subPath = institutionPath + `layer/${data.layerId}`;
      break;
    case "institution":
      subPath = undefined;
      break;
    default:
      return undefined;
  }
  return { subPath, institutionPath };
};

export const courseSpecificUploadTypes = [
  "course-drive",
  "workbench",
  "block",
  "handIn",
  "public",
  "layer",
];

export function isCourseUpload(type: UploadPathType) {
  if (!type) return false;
  return courseSpecificUploadTypes.includes(type);
}

export function isPublicUpload(type: UploadPathType) {
  return type === "public" || type === "logo";
}

export const createListFilesPath = ({
  data,
  institutionId,
  userId,
}: {
  data: FileUploadPathData;
  institutionId: string | null;
  userId: string | null;
}) => {
  let path = `institutions/${institutionId}/`;
  switch (data.type) {
    case "user-drive":
      return (path += `user/${userId}/user-drive${
        data.subPath ? "/" + data.subPath : ""
      }`);
    case "course-drive":
      return (path += `layer/${data.layerId}/course-drive`);
    default:
      throw new Error("Invalid type");
  }
};
