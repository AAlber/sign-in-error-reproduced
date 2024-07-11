import { create } from "zustand";

interface ElementLibrary {
  search: string;
  setSearch: (data: string) => void;
}

const initalState = {
  search: "",
};

const useElementLibrary = create<ElementLibrary>((set) => ({
  ...initalState,

  setSearch: (data) => set(() => ({ search: data })),
}));

export default useElementLibrary;
