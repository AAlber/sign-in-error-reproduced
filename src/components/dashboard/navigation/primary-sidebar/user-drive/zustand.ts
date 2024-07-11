import { create } from "zustand";
import type { DriveTypes } from "@/src/types/storage.types";

interface UserDrive {
  open: boolean;
  openCloud: () => void;
  closeCloud: () => void;

  setHeaderDragEnabled: (drag: boolean) => void;
  headerDragEnabled: boolean;

  setIsDraggingDrive: (drag: boolean) => void;
  isDraggingDrive: boolean;

  focusedDrive?: DriveTypes;
  setFocusedDrive: (drive?: DriveTypes) => void;
}

const initalState = {
  open: false,
  headerDragEnabled: false,
  isDraggingDrive: false,
  focusedDrive: undefined,
};

export const useUserDriveModal = create<UserDrive>()((set) => ({
  ...initalState,
  setOpen: (open) => set({ open }),

  closeCloud: () => {
    set({ open: false });
  },
  openCloud: () => set({ open: true }),
  setHeaderDragEnabled: (headerDragEnabled) => set({ headerDragEnabled }),

  setIsDraggingDrive: (isDraggingDrive) => set({ isDraggingDrive }),
  setFocusedDrive: (focusedDrive) => set({ focusedDrive }),
}));
