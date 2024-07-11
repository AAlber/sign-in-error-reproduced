import { create } from "zustand";
import { persist } from "zustand/middleware";

type DynamicHelpButtonState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  left: boolean;
  setLeft: (left: boolean) => void;
};

const useDynamicHelpButtonStore = create<DynamicHelpButtonState>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open) => set(() => ({ open })),
      left: false,
      setLeft: (left) => set(() => ({ left })),
    }),
    {
      name: "dynamic-help-button",
    },
  ),
);

export default useDynamicHelpButtonStore;
