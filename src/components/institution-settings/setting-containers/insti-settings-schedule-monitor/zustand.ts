import { create } from "zustand";

interface InstitutionSettingsScheduleMonitor {
  loading: boolean;
  setLoading: (data: boolean) => void;
  allLayers: any[];
  setAllLayers: (data: any[]) => void;
  layers: any[];
  setLayers: (data: any[]) => void;
  page: number;
  setPage: (data: number) => void;
}

const initalState = {
  layers: [],
  allLayers: [],
  loading: false,
  page: 0,
};

const useInstitutionSettingsScheduleMonitor =
  create<InstitutionSettingsScheduleMonitor>((set) => ({
    ...initalState,

    setLayers: (data) => set(() => ({ layers: data })),
    setLoading: (data) => set(() => ({ loading: data })),
    setPage: (data) => set(() => ({ page: data })),
    setAllLayers: (data) => set(() => ({ allLayers: data })),
  }));

export default useInstitutionSettingsScheduleMonitor;
