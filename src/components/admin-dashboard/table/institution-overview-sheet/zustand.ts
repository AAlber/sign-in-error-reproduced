import { create } from "zustand";

export type AdminDashFilters =
  | "Test Institution"
  | "Fake Trial (like FHS)"
  | "Subscription"
  | "No Subscription"
  | "No Filter";

interface CreditEditorZustand {
  aiCredits: number | undefined;
  setAiCredits: (aiCredits: number | undefined) => void;

  gbPerUser: number | undefined;
  setGbPerUser: (gbPerUser: number | undefined) => void;

  baseStorageGb: number | undefined;
  setBaseStorageGb: (baseStorageGb: number | undefined) => void;

  accessPassDiscount: number | undefined;
  setAccessPassDiscount: (accessPassDiscount: number | undefined) => void;
}

const initialState = {
  aiCredits: undefined,
  gbPerUser: undefined,
  baseStorageGb: undefined,
  accessPassDiscount: undefined,
};

const setters = (set) => ({
  ...initialState,
  setAiCredits: (aiCredits) => set({ aiCredits }),
  setGbPerUser: (gbPerUser) => set({ gbPerUser }),
  setBaseStorageGb: (baseStorageGb) => set({ baseStorageGb }),
  setAccessPassDiscount: (accessPassDiscount) => set({ accessPassDiscount }),
});

export const useCreditEditorZustand = create<CreditEditorZustand>(setters);
