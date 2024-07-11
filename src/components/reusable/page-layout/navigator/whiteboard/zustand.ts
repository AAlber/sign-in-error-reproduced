import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState } from "@excalidraw/excalidraw/types/types";
import { create } from "zustand";

export type WhiteboardInitialData = {
  elements: ExcalidrawElement[];
  appState: AppState;
};

export enum WhiteboardMode {
  SCRIBBLE = "scribble",
  POST = "post",
}

interface WhiteBoardProps {
  initialData: WhiteboardInitialData;
  isDirty: boolean;
  isOpen: boolean;
  isSafeToRefetchFiles: boolean;
  isSaving: boolean;
  mode: WhiteboardMode;
  name: string;
}

interface WhiteBoardMethods {
  open: (data?: WhiteboardMode) => void;
  close: () => void;
  setIsDirty: (data?: boolean) => void;
  setIsSaving: (data?: boolean) => void;
  setIsSafeToRefetchFiles: (data: boolean) => void;
  setInitialData: (data: WhiteBoardProps["initialData"]) => void;
  setName: (data: string) => void;
  resetState: () => void;
}

const initialState: WhiteBoardProps = {
  initialData: { elements: [], appState: {} as AppState },
  isDirty: false,
  isOpen: false,
  isSafeToRefetchFiles: false,
  isSaving: false,
  mode: WhiteboardMode.SCRIBBLE,
  name: "",
};

const useWhiteBoard = create<WhiteBoardProps & WhiteBoardMethods>((set) => ({
  ...initialState,
  open: (data) =>
    set(() => ({ isOpen: true, mode: data ?? WhiteboardMode.SCRIBBLE })),
  close: () => set(() => ({ isOpen: false })),
  setIsDirty: (data) => set((state) => ({ isDirty: data ?? !state.isDirty })),
  setIsSafeToRefetchFiles: (data) =>
    set(() => ({ isSafeToRefetchFiles: data })),
  setIsSaving: (data) =>
    set((state) => ({ isSaving: data ?? !state.isSaving })),
  setInitialData: (data) => set(() => ({ initialData: data })),
  setName: (data) => set(() => ({ name: data })),
  resetState: () => set(() => initialState),
}));

export default useWhiteBoard;

useWhiteBoard.subscribe((state, prev) => {
  if (prev.isOpen && !state.isOpen) {
    state.resetState();
  }
});
