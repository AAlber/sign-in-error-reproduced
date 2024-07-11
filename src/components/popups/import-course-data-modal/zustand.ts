import { create } from "zustand";

interface ImportCourseDataModal {
  open: boolean;
  overrideData: boolean;
  layerToImportToId: string;
  layerToImportFromId: string;
  setOverrideData: (overrideData: boolean) => void;
  setSelectedLayerId: (layerToImportFromId: string) => void;
  selectedContentBlockIds: string[];
  setSelectedContentBlockIds: (selectedContentBlockIds: string[]) => void;
  setOpen: (open: boolean) => void;
  init: (layerToImportToId: string) => void;
}

const initalState = {
  open: false,
  overrideData: false,
  layerToImportToId: "",
  layerToImportFromId: "",
  selectedContentBlockIds: [],
};

const useImportCourseDataModal = create<ImportCourseDataModal>((set) => ({
  ...initalState,
  setOpen: (open) =>
    set(() => ({
      open,
      layerToImportFromId: "",
      selectedContentBlockIds: [],
    })),
  init: (data) =>
    set(() => ({
      open: true,
      layerToImportToId: data,
      layerToImportFromId: "",
      selectedContentBlockIds: [],
    })),
  setSelectedLayerId: (layerToImportFromId) =>
    set(() => ({ layerToImportFromId: layerToImportFromId })),
  setSelectedContentBlockIds: (selectedContentBlockIds) =>
    set(() => ({ selectedContentBlockIds })),
  setOverrideData: (overrideData: boolean) => set(() => ({ overrideData })),
}));

export default useImportCourseDataModal;
