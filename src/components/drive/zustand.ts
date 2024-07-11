import { create } from "zustand";
import type {
  ReducedR2Object,
  StorageCategory,
} from "@/src/types/storage.types";

export interface DriveZustand {
  idBeingRenamed: string;
  setIdBeingRenamed: (id: string) => void;
  openedFolderId: string;
  setOpenedFolderId: (id: string) => void;
  deepestLastFolderId: string;
  setDeepestLastFolderId: (id: string) => void;
  idsBeingUploaded: string[];
  setIdsBeingUploaded: (ids: string[]) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  folderBeingDraggedOver: string;
  setFolderBeingDraggedOver: (id: string) => void;
  isDriveBeingDraggedOver: boolean;
  setIsDriveBeingDraggedOver: (isBeingDraggedOver: boolean) => void;
  loadingFiles: boolean;
  setLoadingFiles: (loading: boolean) => void;
  currentlyDragging: string;
  setCurrentlyDragging: (draggableId: string) => void;
  expandedIds: string[];
  setExpandedIds: (ids: string[]) => void;

  directoriesBeingDraggedOver: string[];
  setDirectoriesBeingDraggedOver: (ids: string[]) => void;
  reset: () => void;

  currentlyPasting: string[];
  setCurrentlyPasting: (ids: string[]) => void;

  idsBeingDraggedOver: string[];
  setIdsBeingDraggedOver: (data: string[]) => void;

  r2Objects: ReducedR2Object[];
  setR2Objects: (data: ReducedR2Object[]) => void;

  storageCategories?: StorageCategory[];
  setStorageCategories: (data: StorageCategory[]) => void;

  reloadingFiles: boolean;
  setReloadingFiles: (reloading: boolean) => void;
}

const initialState = {
  idBeingRenamed: "",
  openedFolderId: "",
  deepestLastFolderId: "",
  idsBeingUploaded: [],
  selectedIds: [],
  folderBeingDraggedOver: "",
  isDriveBeingDraggedOver: false,
  loadingFiles: false,
  currentlyDragging: "",
  expandedIds: [],
  directoriesBeingDraggedOver: [],
  currentlyPasting: [],
  idsBeingDraggedOver: [],
  r2Objects: [],
  storageCategories: undefined,
  reloadingFiles: false,
};
const setter = (set) => ({
  ...initialState,
  setIdBeingRenamed: (idBeingRenamed) => {
    set(() => ({ idBeingRenamed }));
  },
  setOpenedFolderId: (openedFolderId) => set(() => ({ openedFolderId })),
  setDeepestLastFolderId: (deepestLastFolderId) =>
    set(() => ({ deepestLastFolderId })),
  setIdsBeingUploaded: (idsBeingUploaded) => set(() => ({ idsBeingUploaded })),
  setSelectedIds: (selectedIds) => set(() => ({ selectedIds })),
  setFolderBeingDraggedOver: (folderBeingDraggedOver) =>
    set(() => ({ folderBeingDraggedOver })),
  setIsDriveBeingDraggedOver: (isDriveBeingDraggedOver) =>
    set(() => ({ isDriveBeingDraggedOver })),
  setCurrentlyDragging: (currentlyDragging) =>
    set(() => ({ currentlyDragging })),
  setExpandedIds: (expandedIds) => set(() => ({ expandedIds })),
  setLoadingFiles: (loading) => set(() => ({ loadingFiles: loading })),
  setDirectoriesBeingDraggedOver: (directoriesBeingDraggedOver) =>
    set(() => ({ directoriesBeingDraggedOver })),
  reset: () => {
    const { openedFolderId, expandedIds, deepestLastFolderId, ...rest } =
      initialState;
    set(rest);
  },
  setCurrentlyPasting: (currentlyPasting) => set(() => ({ currentlyPasting })),
  setIdsBeingDraggedOver: (isBeingDraggedOver) =>
    set(() => ({ isBeingDraggedOver })),
  setR2Objects: (r2Objects) => set(() => ({ r2Objects })),
  setStorageCategories: (storageCategories) =>
    set(() => ({ storageCategories })),
  setReloadingFiles: (reloadingFiles) => set(() => ({ reloadingFiles })),
});

export const useUserDrive = create<DriveZustand>()(setter);
export const useCourseDrive = create<DriveZustand>()(setter);
