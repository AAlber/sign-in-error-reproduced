import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Dashboard {
  highlightedLayerId: string;
  layerPathIdsToBeOpened: string[];
  setHighlightedLayerId: (data: string) => void;
  setLayerPathIdsToBeOpened: (data: string[]) => void;
}

const initalState = {
  // todo: move to layer zustand
  highlightedLayerId: "",
  layerPathIdsToBeOpened: [],
};

const useDashboard = create<Dashboard>()(
  persist(
    (set) => ({
      ...initalState,
      setHighlightedLayerId: (data) =>
        set(() => ({ highlightedLayerId: data })),
      setLayerPathIdsToBeOpened: (data) =>
        set(() => ({ layerPathIdsToBeOpened: data })),
    }),
    {
      name: "dashboard",
    },
  ),
);

export default useDashboard;
