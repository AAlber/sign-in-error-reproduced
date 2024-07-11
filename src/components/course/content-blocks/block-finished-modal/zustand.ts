import { create } from "zustand";

interface Modal {
  open: boolean;
  blockId: string | null;
  setOpen: (data: boolean) => void;
}

const initalState = {
  open: false,
  blockId: null,
};

const useContentBlockFinishedModal = create<Modal>((set) => ({
  ...initalState,
  setOpen: (data) => set(() => ({ open: data })),
}));

export default useContentBlockFinishedModal;
