import { create } from "zustand";
import { persist } from "zustand/middleware";

type LearnMenuId = string;
type IsOpen = boolean;

type LearnDialogState = {
  focusVideo: string | null;
  setFocusVideo: (video: string) => void;
  menuStates: Record<LearnMenuId, IsOpen>;
  toggleMenu: (id: LearnMenuId, focusVideo?: string) => void;
  openMenu: (id: LearnMenuId, focusVideo?: string) => void;
};

export const useLearnDialog = create<LearnDialogState>()(
  persist(
    (set) => ({
      focusVideo: null,
      menuStates: {},
      setFocusVideo: (video) => set({ focusVideo: video }),
      toggleMenu: (id, focusVideo) => {
        set((state) => ({
          menuStates: {
            ...state.menuStates,
            [id]: !state.menuStates[id],
          },
          focusVideo: focusVideo || state.focusVideo,
        }));
      },
      openMenu: (id, focusVideo) =>
        set((state) => ({
          menuStates: {
            ...state.menuStates,
            [id]: true,
          },
          focusVideo: focusVideo || state.focusVideo,
        })),
    }),
    { name: "learn-dialog" },
  ),
);
