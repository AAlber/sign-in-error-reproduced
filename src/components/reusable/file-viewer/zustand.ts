import { create } from "zustand";

interface FileViewer {
  pspdfkit: any;
  setPSPDFKit: (data: any) => void;
}

const initalState = {
  pspdfkit: null as any,
};

const useFileViewer = create<FileViewer>((set) => ({
  ...initalState,

  setPSPDFKit: (data) => set(() => ({ pspdfkit: data })),
}));

export default useFileViewer;
