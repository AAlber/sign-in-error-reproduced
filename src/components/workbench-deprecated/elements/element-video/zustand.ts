import { create } from "zustand";

interface VideoSelector {
  link: string;
  openVideoSelector: boolean;
  setLink: (data: string) => void;
  setOpenVideoSelector: (data: boolean) => void;
}

const initalState = {
  link: "",
  openVideoSelector: false,
};

export const useVideoSelector = create<VideoSelector>((set) => ({
  ...initalState,

  setLink: (data: string) => set({ link: data }),
  setOpenVideoSelector: (data: boolean) => set({ openVideoSelector: data }),
}));
