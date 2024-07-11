import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BLockNewBadgeState = {
  idsToDisplay: string[];
  setIdsToDisplay: (ids: string[]) => void;
  viwedIds: string[];
  addToViewedIds: (id: string) => void;
};

export const useBlockNewBadge = create<BLockNewBadgeState>()(
  persist(
    (set) => ({
      idsToDisplay: [],
      setIdsToDisplay: (ids) => set(() => ({ idsToDisplay: ids })),
      viwedIds: [],
      addToViewedIds: (id) =>
        set((state) => ({ viwedIds: [...state.viwedIds, id] })),
    }),
    {
      name: "block-new-badge",
    },
  ),
);
