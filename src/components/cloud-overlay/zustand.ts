import { create } from "zustand";
import type { DownloadFileType } from "@/src/client-functions/client-firebase";
import type { Drive } from "./classes/drive";
import { FuxamDrive } from "./classes/fuxam-drive";
import { GoogleDrive } from "./classes/google-drive";

interface CloudOverlay {
  drive: any;
  acceptedFileTypes: string[];
  currentPath: string;
  files: any[];
  googlePath: string;
  googleLastFolder: string | null;
  fuxamLastFolder: string | null;
  isLoaded: boolean;
  uploadStep: number | null;
  deleteStep: number | null;
  newFolderName: string;
  driveObject: Drive;
  googleIsValid: boolean;
  highlightedFile: DownloadFileType | null;
  selectedColumn: string;
  disabledFolders: string[];
  setDisabledFolders: (folderIds: string[]) => void;
  setSelectedColumn: (column: string) => void;
  onCloudImportSelect: () => void;
  onCloudImportCancel: () => void;
  onCloudExportSave: () => void;
  setHighlightedFile: (file: any) => void;
  setFiles: (files: any) => void;
  setDriveObject: (drive: Drive) => void;
  setGoogleIsValid: (isValid: boolean) => void;
  setNewFolderName: (name: string) => void;
  setLoaded: (loaded: boolean) => void;
  setFuxamLastFolder: (path: string | null) => void;
  setGoogleLastFolder: (path: string | null) => void;
  setGooglePath: (path: string) => void;
  setDrive: (data: any) => void;
  setCurrentPath: (path: string) => void;

  setUploadStep: (value: number | null) => void;
  setDeleteStep: (value: number | null) => void;
}

export const driveProviders = [
  {
    id: 0,
    name: "cloud.provider_fuxam.title",
    description: "cloud.provider_fuxam.description",
    size: "w-8 h-8",
    icon: "/logo.svg",
  },
  {
    id: 1,
    name: "cloud.provider_google.title",
    badge: {
      text: "cloud.provider_badge_coming_soon",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    description: "cloud.provider_google.description",
    size: "w-8 h-8",
    icon: "/images/cloud/googledrive.svg",
  },
  {
    id: 2,
    name: "cloud.provider_onedrive.title",
    description: "cloud.provider_onedrive.description",
    badge: {
      text: "cloud.provider_badge_coming_soon",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    size: "w-8 h-8",
    icon: "/images/cloud/onedrive.svg",
  },
];

const googleDrive = new GoogleDrive("", [], null, "");
const fuxamDrive = new FuxamDrive("", [], null, "");
const initalState = {
  drive: driveProviders[0],
  files: [],
  selectedColumn: "",
  googleIsValid: false,
  currentPath: "",
  highlightedFile: null,
  driveObject: true ? fuxamDrive : googleDrive,
  // remove folder history

  googleFolderHistory: [""],
  googleFolderIndex: 0,
  googlePath: "",
  fuxamFolderHistory: [""],
  fuxamFolderIndex: 0,
  isLoaded: false,
  fuxamLastFolder: null,
  fuxamParentFolder: "",
  newFolderName: "",
  acceptedFileTypes: [],
  googleLastFolder: null,
  googleParentFolder: "",
  uploadStep: null, // 0 - 4
  deleteStep: null, // 0 - 4
  disabledFolders: [],
  onCloudImportSelect: () => alert("No action specified for imports."),
  onCloudImportCancel: () =>
    alert("No action specified for cancelling imports."),
  onCloudExportSave: () => alert("No action specified for imports."),
};

const useCloudOverlay = create<CloudOverlay>((set, get) => ({
  ...initalState,
  setDisabledFolders: (folderIds: string[]) =>
    set({ disabledFolders: folderIds }),
  setHighlightedFile: (file: DownloadFileType) =>
    set({ highlightedFile: file }),
  setSelectedColumn: (column: string) => set({ selectedColumn: column }),
  setFiles: (files: any) => set({ files: files }),
  setGoogleIsValid: (isValid: boolean) => set({ googleIsValid: isValid }),
  setDrive: (data: any) => set({ drive: data }),
  setCurrentPath: (path: string) => set({ currentPath: path }),
  setGooglePath: (path: string) => set({ googlePath: path }),
  setLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
  setFuxamLastFolder: (path: string | null) => set({ fuxamLastFolder: path }),
  setGoogleLastFolder: (path: string | null) => set({ googleLastFolder: path }),
  setUploadStep: (value: number | null) => set({ uploadStep: value }),
  setDeleteStep: (value: number | null) => set({ deleteStep: value }),
  setNewFolderName: (name: string) => set({ newFolderName: name }),
  setDriveObject: (drive: Drive) => set({ driveObject: drive }),
}));

export default useCloudOverlay;
