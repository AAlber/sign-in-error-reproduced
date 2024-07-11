import { create } from "zustand";

export type Modal = {
  open: boolean;
  step: number;
  totalSteps: number;
  setOpen: (open: boolean) => void;
  setStep: (step: number) => void;
  setTotalSteps: (totalSteps: number) => void;
  reset: () => void;
};

const initialState = {
  open: false,
  step: 1,
  totalSteps: 1,
};

export const useModal = create<Modal>((set) => ({
  ...initialState,
  setOpen: (open) => set({ open }),
  setStep: (step) => set({ step }),
  setTotalSteps: (totalSteps) => set({ totalSteps }),
  reset: () => set(initialState),
}));
