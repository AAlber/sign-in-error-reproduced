import { create } from "zustand";

interface FileView {
  open: boolean;
  fileUrl: string;
  fileName: string;
  secureMode: boolean;
  setOpen: (data: boolean) => void;
  initSheet: (data: {
    fileUrl: string;
    fileName: string;
    secureMode: boolean;
  }) => void;
  reset: () => void;
}

const initalState = {
  open: false,
  secureMode: false,
  fileUrl: "",
  fileName: "",
};

const useFileViewerSheet = create<FileView>((set) => ({
  ...initalState,
  setOpen: (data) => set(() => ({ open: data })),
  initSheet: (data) => set(() => ({ ...data, open: true })),
  reset: () => set(() => ({ ...initalState })),
}));

export default useFileViewerSheet;
