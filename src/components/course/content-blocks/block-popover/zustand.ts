import { create } from "zustand";

interface BlockPopover {
  openBlock: string | null;
  setOpenBlock: (data: string | null) => void;
}

const initalState = {
  openBlock: null,
};

const useBlockPopover = create<BlockPopover>((set) => ({
  ...initalState,

  setOpenBlock: (data) => set(() => ({ openBlock: data })),
}));

export default useBlockPopover;

export function manuallyOpenContentBlockPopover(blockId: string) {
  useBlockPopover.setState({ openBlock: blockId });
}
