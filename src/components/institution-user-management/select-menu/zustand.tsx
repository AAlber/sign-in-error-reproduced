import { create } from "zustand";

type FilteredState = {
  filteredUserIds: string[];
  addUsersToFilter: (ids: string[]) => void;
  removeUsersFromFilter: (ids: string[]) => void;
  emptyFilter: () => void;
};

export const useSelectMenuUserFilter = create<FilteredState>()((set) => ({
  filteredUserIds: [],
  addUsersToFilter: (ids) =>
    set((state) => {
      const pushedIds = state.filteredUserIds.concat(ids);
      return {
        filteredUserIds: Array.from(new Set(pushedIds)),
      };
    }),
  emptyFilter: () => set(() => ({ filteredUserIds: [] })),
  removeUsersFromFilter: (ids) =>
    set((state) => {
      return {
        filteredUserIds: state.filteredUserIds.filter(
          (id) => !ids.includes(id),
        ),
      };
    }),
}));
