import { create } from "zustand";

interface Finder {
  open: boolean;
  mode: "search" | "chat";
  setOpen: (open: boolean) => void;
  setMode: (mode: "search" | "chat") => void;
}

const initalState = {
  open: false,
  mode: "search" as const,
};

const useFinder = create<Finder>((set) => ({
  ...initalState,
  setOpen: (open) => set({ open }),
  setMode: (mode) => set({ mode }),
}));

export default useFinder;
