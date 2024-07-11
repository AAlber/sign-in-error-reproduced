import { create } from "zustand";
import type { CarouselApi } from "../shadcn-ui/carousel";

interface ProgressScreenStore {
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
  count: number;
  setCount: (count: number) => void;
  carouselApi: CarouselApi;
  setCarouselApi: (api: CarouselApi) => void;
  bgColors: string[];
}

const initialState = {
  currentScreen: 0,
  count: 0,
  carouselApi: undefined,
  bgColors: [
    "bg-fuxam-pink",
    "bg-fuxam-orange",
    "bg-fuxam-yellow",
    "bg-fuxam-green",
    "bg-fuxam-blue",
  ],
};

export const useProgressScreenStore = create<ProgressScreenStore>((set) => ({
  ...initialState,
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setCount: (count) => set({ count }),
  setCarouselApi: (api) => set({ carouselApi: api }),
}));
