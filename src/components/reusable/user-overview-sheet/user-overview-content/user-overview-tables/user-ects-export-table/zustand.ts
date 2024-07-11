import { create } from "zustand";

interface ECTsExport {
  selectedCourseIds: string[];
  exportStructure: "flat" | "grouped";
  setSelectedCourseIds: (courseIds: string[]) => void;
  setExportStructure: (exportStructure: "flat" | "grouped") => void;
  setDataPointToExport: (data: Partial<ECTsDataPointsToExport>) => void;
}

type ECTsDataPointsToExport = {
  includeTimeConstrainingLayer: boolean;
  markCoursesAsInProgress: boolean;
  attendance: boolean;
  prerequisites: boolean;
  points: boolean;
  status: boolean;
};

const initalState = {
  selectedCourseIds: [],
  exportStructure: "flat" as const,
  includeTimeConstrainingLayer: false,
  markCoursesAsInProgress: true,
  attendance: true,
  prerequisites: true,
  points: true,
  status: true,
};

const useECTsExport = create<ECTsExport & ECTsDataPointsToExport>((set) => ({
  ...initalState,
  setSelectedCourseIds: (selectedCourseIds) => set({ selectedCourseIds }),
  setExportStructure: (exportStructure) => set({ exportStructure }),
  setDataPointToExport: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),
}));

export default useECTsExport;
