import { create } from "zustand";
import type { ScheduleProps } from "../schedule";

interface ScheduleSlider {
  open: boolean;
  fullScreen: boolean;
  filteredLayerIds: string[];
  monitorMode: boolean;
  halfScreen: boolean;
  setOpen: (data: boolean) => void;
  initSchedule: (data?: ScheduleProps) => void;
  initMonitor: () => void;
  setFullScreen: (data: boolean) => void;
  setMonitorMode: (data: boolean) => void;
  setHalfScreen: (data: boolean) => void;
}

const initalState = {
  open: false,
  fullScreen: false,
  filteredLayerIds: [],
  monitorMode: false,
  halfScreen: false,
};

const useScheduleSlider = create<ScheduleSlider>((set) => ({
  ...initalState,

  setOpen: (data) => set(() => ({ open: data })),
  initSchedule: (data) =>
    set(() => ({ ...data, monitorMode: false, open: true })),
  initMonitor: () =>
    set(() => ({
      ...initalState,
      monitorMode: true,
      open: true,
      fullScreen: true,
    })),
  setFullScreen: (data) => set(() => ({ fullScreen: data })),
  setMonitorMode: (data) => set(() => ({ monitorMode: data })),
  setHalfScreen: (data) => set(() => ({ halfScreen: data })),
}));

export default useScheduleSlider;
