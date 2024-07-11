import { create } from "zustand";

type State = {
  open: boolean;
  setOpen: (data: State["open"]) => void;
};

const useImportUser = create<State>()((set) => ({
  open: false,
  setOpen: (data) => set(() => ({ open: data })),
}));

export default useImportUser;
