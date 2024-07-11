import { create } from "zustand";
import type { ContentBlock } from "@/src/types/course.types";

interface ContentBlockOverview {
  open: boolean;
  block: ContentBlock | null;
  refresh: number;
  setOpen: (open: boolean) => void;
  reset: () => void;
  refreshOverview: () => void;
  setBlock: (block: ContentBlock) => void;
  openOverview: (block: ContentBlock) => void;
}

const initalState = {
  open: false,
  block: null,
  refresh: 0,
};

const useContentBlockOverview = create<ContentBlockOverview>()((set) => ({
  ...initalState,

  setOpen: (data) => set({ open: data }),
  reset: () => set(initalState),
  openOverview: (block) => set({ open: true, block }),
  setBlock: (block) => set({ block }),
  refreshOverview: () => set({ refresh: Date.now() }),
}));

export default useContentBlockOverview;
