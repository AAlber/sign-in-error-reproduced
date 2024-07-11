import type { Layer } from "@prisma/client";
import { create } from "zustand";

interface LayerSettings {
  open: boolean;
  layer: Layer | null;
  title: string;
  subtitle: string;
  displayName: string;
  startTime: Date | null;
  endTime: Date | null;
  close: () => void;
  setTitle: (data: string) => void;
  setSubtitle: (data: string) => void;
  setDisplayName: (data: string) => void;
  setOpen: (data: boolean) => void;
  init: (data: { layer: Layer }) => void;
  setStartTime: (data: Date | null) => void;
  setEndTime: (data: Date | null) => void;
  reset: () => void;
}

const initalState = {
  open: false,
  title: "",
  subtitle: "",
  layer: null,
  startTime: null,
  endTime: null,
  displayName: "",
};

const useLayerSettings = create<LayerSettings>((set) => ({
  ...initalState,

  setTitle: (data) => set(() => ({ title: data })),
  setSubtitle: (data) => set(() => ({ subtitle: data })),
  setDisplayName: (data) => set(() => ({ displayName: data })),
  setOpen: (data) => set(() => ({ open: data })),
  setStartTime: (data) => set(() => ({ startTime: data })),
  setEndTime: (data) => set(() => ({ endTime: data })),
  reset: () => set(() => ({ ...initalState })),
  close: () => set(() => ({ open: false })),
  init: (data) =>
    set(() => ({
      ...data,
      startTime: data.layer.start,
      endTime: data.layer.end,
      open: true,
    })),
}));

export default useLayerSettings;
