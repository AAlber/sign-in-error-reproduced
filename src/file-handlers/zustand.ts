import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum OpenOrigin {
  BlockContentEditor,
  Cloud,
  LobbyChat,
  LearningBlocks,
  AssessmentBlocks,
  Default,
}

interface ContentBlockEditor {
  openOrigin: OpenOrigin;
  setOpenedFrom: (data: OpenOrigin) => void;
}

const initalState = {
  openOrigin: OpenOrigin.Default,
};

const useFile = create<ContentBlockEditor>()(
  persist(
    (set) => ({
      ...initalState,
      setOpenedFrom: (data) => set(() => ({ openOrigin: data })),
    }),
    { name: "useFile" },
  ),
);

export default useFile;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useFile", useFile);
}
