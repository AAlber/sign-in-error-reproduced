import { create } from "zustand";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";

export interface HandInDynamicPopoverState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handInUsers: ContentBlockUserStatus<"HandIn">[];
  setHandInUsers: (users: ContentBlockUserStatus<"HandIn">[]) => void;
  blocksChanged: boolean;
  setBlocksChanged: (blocksChanged: boolean) => void;
}

export const useHandInDynamicPopover = create<HandInDynamicPopoverState>(
  (set) => ({
    loading: true,
    setLoading: (loading) => set({ loading }),
    handInUsers: [],
    setHandInUsers: (handInUsers) => set({ handInUsers }),
    blocksChanged: false,
    setBlocksChanged: (blocksChanged) => set({ blocksChanged }),
  }),
);
