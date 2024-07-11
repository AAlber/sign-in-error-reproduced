import type { ClientRect } from "@dnd-kit/core";
import { create } from "zustand";
import type { DragPosition } from "@/src/client-functions/client-schedule";

type State = {
  containerRect: OrNull<ContainerRect>;
  draggingDisabled: boolean;
  isResizing: boolean;
  gridOverlayPosition: OrNull<DragPosition>;
  /** The updated duration during while resizing/extending an appointment */
  resizedDuration: number;
  isOverDraggable: boolean;
  setContainerRect: (data: State["containerRect"]) => void;
  setIsOverDraggable: (data: State["isOverDraggable"]) => void;
  setNewDuration: (data: number) => void;
  setGridOverlayPosition: (data: State["gridOverlayPosition"]) => void;
  setIsResizing: (data: boolean) => void;
};

export const useCalendarDrag = create<State>()((set) => ({
  calendarContainerRect: null,
  containerRect: null,
  draggingDisabled: false,
  gridOverlayPosition: null,
  isOverDraggable: false,
  isResizing: false,
  lastActiveId: undefined,
  resizedDuration: 0,
  setContainerRect: (data) => set({ containerRect: data }),
  setIsOverDraggable: (data) => set({ isOverDraggable: data }),
  setNewDuration: (data) => set({ resizedDuration: data }),
  setGridOverlayPosition: (data) => set({ gridOverlayPosition: data }),
  setIsResizing: (isResizing) => set({ isResizing }),
}));

export type ContainerRect = ClientRect & {
  element: HTMLElement;
  rowHeight: number;
  rowWidth: number;
};
