import { create } from "zustand";
import type { CustomScheduleFilter } from "@/src/types/appointment.types";
import type { Room } from "../institution-settings/setting-containers/insti-settings-room-management/data-table/columns";

interface ScheduleFilter {
  filteredLayers: string[];
  setFilteredLayers: (data: string[]) => void;
  modalOpen: boolean;
  setModalOpen: (data: boolean) => void;
  customFilters: CustomScheduleFilter[];
  setCustomFilters: (data: CustomScheduleFilter[]) => void;
  filtersChanged: boolean;
  setFiltersChanged: (data: boolean) => void;
  customFilterLoading: boolean;
  setCustomFilterLoading: (data: boolean) => void;
  haveNewCustomFilter: boolean;
  setHaveNewCustomFilter: (data: boolean) => void;
  setOnlyOrganizedByMe: (data: boolean) => void;
  onlyOrganizedByMe: boolean;
  filteredRoom?: Room;
  setFilteredRoom: (data?: Room) => void;
  clearFilters: () => void;
}

const initalState = {
  filteredLayers: [],
  customFilters: [],
  modalOpen: false,
  filtersChanged: false,
  customFilterLoading: true,
  haveNewCustomFilter: false,
  onlyOrganizedByMe: false,
  filteredRoom: undefined,
};

const useScheduleFilter = create<ScheduleFilter>((set) => ({
  ...initalState,
  setFilteredLayers: (data) =>
    set({ filteredLayers: data, filteredRoom: undefined }),
  setModalOpen: (data) => set({ modalOpen: data }),
  setCustomFilters: (data) => set({ customFilters: data }),
  setFiltersChanged: (data) => set({ filtersChanged: data }),
  setCustomFilterLoading: (data) => set({ customFilterLoading: data }),
  setHaveNewCustomFilter: (data) => set({ haveNewCustomFilter: data }),
  setOnlyOrganizedByMe: (data) => set({ onlyOrganizedByMe: data }),
  setFilteredRoom: (data) => set({ filteredRoom: data }),
  clearFilters: () =>
    set((state) => {
      return {
        ...state,
        filteredLayers: [],
        onlyOrganizedByMe: false,
        filteredRoom: undefined,
      };
    }),
}));

export default useScheduleFilter;
