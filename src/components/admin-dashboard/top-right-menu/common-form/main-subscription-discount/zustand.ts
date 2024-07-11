import { create } from "zustand";

export type DiscountCreator = {
  amountOff?: number;
  setAmountOff: (amountOff?: number) => void;
  percentOff?: number;
  setPercentOff: (percentOff?: number) => void;
  type: "once" | "repeating" | "forever";
  setType: (type: "once" | "repeating" | "forever") => void;
  durationInMonths?: number;
  setDurationInMonths: (durationInMonths?: number) => void;
};

const initialState = {
  amountOff: undefined,
  percentOff: undefined,
  type: "once" as "once" | "repeating" | "forever",
  durationInMonths: undefined,
};

const setters = (set) => ({
  ...initialState,
  setAmountOff: (amountOff?: number) =>
    set((state) => ({ ...state, amountOff })),
  setPercentOff: (percentOff?: number) =>
    set((state) => ({ ...state, percentOff })),
  setType: (type: "once" | "repeating" | "forever") =>
    set((state) => ({ ...state, type })),
  setDurationInMonths: (durationInMonths?: number) =>
    set((state) => ({ ...state, durationInMonths })),
});

export const useDiscountCreator = create<DiscountCreator>(setters);
// export const useDiscountCreator = create<Discount>(setters)
