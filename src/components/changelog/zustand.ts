import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  idToShow?: string;
}

interface ChangelogStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  changelog: Changelog[];
  setChangelog: (changelog: Changelog[]) => void;
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  viewedIds: string[];
  addToViewedIds: (id: string) => void;
  idsToShow: string[];
  setIdsToShow: (ids: string[]) => void;
  noNewChangelog: boolean;
  setNoNewChangelog: (noNewChangelog: boolean) => void;
}

const initialState = {
  open: false,
  changelog: [],
  pagination: {
    page: 1,
    limit: 1,
    total: 0,
    idToShow: undefined,
  },
  loading: true,
  viewedIds: [],
  idsToShow: [],
  noNewChangelog: false,
};

const useChangelogStore = create<ChangelogStore>()(
  persist(
    (set) => ({
      ...initialState,
      setOpen: (open) => set(() => ({ open })),
      setChangelog: (changelog) => set(() => ({ changelog })),
      setPagination: (pagination) => set(() => ({ pagination })),
      setLoading: (loading) => set(() => ({ loading })),
      addToViewedIds: (id) =>
        set((state) => ({
          viewedIds: state.viewedIds.includes(id)
            ? state.viewedIds
            : [...state.viewedIds, id],
        })),
      setIdsToShow: (ids) => set(() => ({ idsToShow: ids })),
      setNoNewChangelog: (noNewChangelog) => set(() => ({ noNewChangelog })),
    }),
    {
      name: "changelog-storage",
    },
  ),
);

export default useChangelogStore;
