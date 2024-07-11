import { create } from "zustand";
import type { UserGroup } from "@/src/components/institution-settings/setting-containers/insti-settings-groups";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";

type State = {
  pageNumber: number;
  pageSize: number;
  search: string;
  totalPages: number;
  filterGroups: UserGroup[];
  filteredLayers: LayerUserHasAccessTo[];
};

type Methods = {
  clearFilters: () => void;
  setFilterGroups: (filterGroups: UserGroup[]) => void;
  setFilteredLayers: (data: LayerUserHasAccessTo[]) => void;
  setPageNumber: (data: State["pageNumber"]) => void;
  setPageSize: (data: State["pageSize"]) => void;
  setSearch: (data: State["search"]) => void;
  setTotalPages: (data: State["totalPages"]) => void;
};

export const pageSizesSelection = [10, 20, 30, 40, 50];

const initalState: State = {
  filterGroups: [],
  filteredLayers: [],
  pageNumber: 1,
  pageSize: pageSizesSelection[0]!,
  search: "",
  totalPages: 1,
};

const useInstitutionUserManagementFilter = create<State & Methods>()((set) => ({
  ...initalState,
  setFilterGroups: (filterGroups) => set(() => ({ filterGroups })),
  setFilteredLayers: (filteredLayers) => set(() => ({ filteredLayers })),
  setPageNumber: (pageNumber) => set(() => ({ pageNumber })),
  setPageSize: (pageSize) => set(() => ({ pageSize })),
  setSearch: (search) => set(() => ({ search })),
  setTotalPages: (totalPages) => set(() => ({ totalPages })),
  clearFilters: () => set(() => initalState),
}));

export default useInstitutionUserManagementFilter;

useInstitutionUserManagementFilter.subscribe((state, prev) => {
  switch (true) {
    case state.pageSize !== prev.pageSize:
    case state.search !== prev.search:
    case state.filteredLayers.length !== prev.filteredLayers.length:
    case state.filterGroups.length !== prev.filterGroups.length:
      useInstitutionUserManagementFilter.setState({ pageNumber: 1 });
      break;
  }
});
