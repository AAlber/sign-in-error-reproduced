import { create } from "zustand";

interface ECTsExport {
  selectedCourseIds: string[];
  exportStructure: "flat" | "grouped";
  includeTimeConstrainingLayer: boolean;
  setSelectedCourseIds: (courseIds: string[]) => void;
  setExportStructure: (exportStructure: "flat" | "grouped") => void;
  setIncludeTimeConstrainingLayer: (
    includeTimeConstrainingLayer: boolean,
  ) => void;
}

const initalState = {
  selectedCourseIds: [],
  exportStructure: "flat" as const,
  includeTimeConstrainingLayer: false,
};

const useECTsExport = create<ECTsExport>((set) => ({
  ...initalState,
  setSelectedCourseIds: (selectedCourseIds) => set({ selectedCourseIds }),
  setExportStructure: (exportStructure) => set({ exportStructure }),
  setIncludeTimeConstrainingLayer: (includeTimeConstrainingLayer) =>
    set({ includeTimeConstrainingLayer }),
}));

export default useECTsExport;
