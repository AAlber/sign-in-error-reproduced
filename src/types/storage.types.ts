import type { _Object, CopyObjectCommandOutput } from "@aws-sdk/client-s3";
import type {
  InstitutionR2Object,
  InstitutionStripeAccount,
} from "@prisma/client";
import type { FailedUppyFile, UploadedUppyFile, Uppy } from "@uppy/core";
import type { INode } from "react-accessible-treeview";

export type UploadPathType =
  | "user-drive"
  | "logo"
  | "block"
  | "handIn"
  | "workbench"
  | "course-drive"
  | "layer"
  | "public"
  | "user-documents"
  | "institution"
  | undefined;

export interface BaseStorageInput {
  type: UploadPathType;
}

export interface UserUploadPathData extends BaseStorageInput {
  type: "user-drive";
  subPath?: string;
}

export interface InstitutionUploadPathData extends BaseStorageInput {
  type: "institution";
  subPath?: string;
}

export interface LayerUploadPathData extends BaseStorageInput {
  type: "layer";
  layerId: string;
  subPath?: string;
}

export interface PublicUploadPathData extends BaseStorageInput {
  type: "public";
  subPath?: string;
}

export interface UserDocumentUploadPathData extends BaseStorageInput {
  type: "user-documents";
  userId: string;
  subPath?: string;
}

export interface LogoUploadPathData extends BaseStorageInput {
  type: "logo";
}

export interface BlockUploadPathData extends BaseStorageInput {
  type: "block";
  layerId: string;
  blockId: string;
}

export interface HandInUploadPathData extends BaseStorageInput {
  type: "handIn";
  layerId: string;
  blockId: string;
}

export interface WorkbenchUploadPathData extends BaseStorageInput {
  type: "workbench";
  layerId: string;
  elementId: string;
  blockId: string;
}

export interface CourseDriveUploadPathData extends BaseStorageInput {
  type: "course-drive";
  layerId: string;
  subPath?: string;
}

export interface UndefinedUploadPathData extends BaseStorageInput {
  type: undefined;
}

export type CreateFolderData = (
  | UserUploadPathData
  | CourseDriveUploadPathData
) & {
  folderName: string;
};

export type FileUploadPathData =
  | UserUploadPathData
  | LogoUploadPathData
  | BlockUploadPathData
  | HandInUploadPathData
  | WorkbenchUploadPathData
  | LayerUploadPathData
  | UserDocumentUploadPathData
  | PublicUploadPathData
  | CourseDriveUploadPathData
  | CreateFolderData
  | UserDocumentUploadPathData
  | InstitutionUploadPathData
  | UndefinedUploadPathData;

export type UploadPathDataWithFile = FileUploadPathData & {
  fileName: string;
  contentType: string;
  order: number;
  size: number;
};

export type UploadPathDataWithInstitutionId = FileUploadPathData & {
  institutionId?: string;
};

export interface FileDeleteInput extends BaseStorageInput {
  url: string;
  isFolder: boolean;
}

export type UppyUploadedFile = UploadedUppyFile<
  Record<string, unknown>,
  Record<string, unknown>
>;

export type UppyFailedUploadFile = FailedUppyFile<
  Record<string, unknown>,
  Record<string, unknown>
>;

export type CopyContentBlockFilesData = {
  originLayerId: string;
  copyToLayerId: string;
  originContentBlockId: string;
  copyToContentBlockId: string;
  contentBlockStorageType: Extract<
    UploadPathType,
    "handIn" | "workbench" | "block"
  >;
};

export type UppyType = Uppy<Record<string, unknown>, Record<string, unknown>>;

export type DataFile = {
  id: string;
  name: string;
  type: Omit<string, "folder">;
  size: number;
  lastModified: Date;
};

export type FolderNameResult = {
  directoryName: string;
  isFolder: boolean;
};

export type ProcessR2ObjectParams = {
  fileObjects: _Object[];
  currentObject: _Object;
  folders: Folder[];
  files: DataFile[];
  key: string;
};

export type Folder = {
  name: string;
  size: number;
  type: "folder";
  id: string;
  lastModified: Date;
  objects?: _Object[];
  children: DriveTreeNode[];
};

export type DriveTreeNode = Folder | DataFile;

export type StorageStatus = {
  totalSize: number;
  categories: StorageCategory[];
};

export type StorageCategory = {
  size: number;
  title: string;
};

export type DriveTypes = "course-drive" | "user-drive";

export type MoveFilesData = {
  pathsToBeCopied: PathsToBeCopied[];
  destinationUrl: string;
  deleteOriginalFolders?: boolean;
};

export type PathsToBeCopied = {
  path: string;
  folderPath?: string | undefined;
  treeDirectory?: DriveTreeNode;
};

export type TransferType =
  | "course-drive"
  | "user-drive"
  | "course-drive-to-user"
  | "course-drive-to-course-drive"
  | "user-to-course-drive"
  | "base-path-mismatch";

export type SharedProperties = {
  id: string;
  size: number;
  lastModified: Date;
  name: string;
};

export type ReducedR2Object = {
  Key: string;
  Size: number;
  LastModified: Date;
};

export type SingleDeleteFileOrFolderData = { url: string; isFolder: boolean };
export type DeleteMultipleDirectoriesData = SingleDeleteFileOrFolderData[];

export type NewMoveFilesData = {
  sourceKey: string;
  destinationKey: string;
  deleteSourceKey: boolean;
};

export type BackendMoveFilesData = { data: NewMoveFilesData[] } & {
  destinationBaseKey: string;
};

export type GetDirectoryByIdData = {
  id: string;
};

export type GetDirectoryByElementData = {
  element: INode<any>;
};

export type GetDirectoryData = GetDirectoryByIdData | GetDirectoryByElementData;

export type ListDirectoryReturnData = {
  storageCategories: StorageCategory[];
  r2Objects: ReducedR2Object[];
};

export interface TreeNode extends INode<any> {
  id: number;
  name: string;
  key: string;
  children: number[]; // Array of child node IDs
  parent: number | null; // ID of the parent node, null for root
}

export type MoveFileAuthData = {
  transferType: TransferType;
  moveFilesData: BackendMoveFilesData;
  userId: string;
  institutionId: string;
};

export type AuthBaseData = {
  type: UploadPathType;
};

export type AuthInstitutionData = AuthBaseData & {
  institutionId?: string | null;
};

export type AuthLayerData = AuthInstitutionData & {
  layerId?: string | null;
};

export type AuthBlockData = AuthLayerData & {
  blockId?: string | null;
};

export type AuthUserData = AuthInstitutionData & {
  userId?: string | null;
};

export type AuthSubPathData = AuthBaseData & {
  subPath?: string | null;
};

export type AuthHandInData = AuthLayerData & {
  userId?: string | null;
};

export type AuthWorkbenchData = AuthBlockData & {
  elementId?: string | null;
};

export type AuthData =
  | AuthBaseData
  | AuthInstitutionData
  | AuthLayerData
  | AuthBlockData
  | AuthUserData
  | AuthSubPathData
  | AuthHandInData
  | AuthWorkbenchData;

export interface AuthorizationParams {
  userId: string;
  institutionId?: string;
  urls: string[];
}
export type InstitutionAndStorageInfo = {
  institutionId?: string;
  stripeAccount?: InstitutionStripeAccount | null;
  storageInfo?: InstitutionWithStorageLimits;
};
export type InstitutionWithStorageLimits = {
  courseLimit: number;
  userLimit: number;
  baseGB: number;
  gbPerUser: number;
  r2Objects?: InstitutionR2Object[];
};

export type ReducedR2ObjectWithName = ReducedR2Object & { name: string };

export type MoveFilesResult = NewMoveFilesData & {
  result: CopyObjectCommandOutput;
};

export type DeletionResult = { statusCode: number; key?: string };

export type InstitutionR2ObjectCreateInput = {
  key: string;
  size: number;
  lastModified: Date;
};

export type InstitutionStorageStatus = {
  totalSize: number;
  userDrivesSize: number;
  courseDrivesSize: number;
};

export type LimitReachedError = {
  message: string;
  limit: string;
};

export type UploadStorageSizes = {
  totalStorageSize: number;
  subStorageSize: number | undefined;
};
