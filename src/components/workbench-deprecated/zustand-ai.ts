import { create } from "zustand";

interface WorkbenchGenerationStatus {
  generatingElements: string[];
  addElementToGeneratingElements: (elementId: string) => void;
  removeElementFromGeneratingElements: (elementId: string) => void;
  isElementGenerating: (elementId: string) => boolean;
  reset: () => void;
}

const initalState = {
  generatingElements: [],
};

const useWorkbenchGenerationStatus = create<WorkbenchGenerationStatus>(
  (set, get) => ({
    ...initalState,
    addElementToGeneratingElements: (elementId) => {
      set((state) => ({
        generatingElements: [...state.generatingElements, elementId],
      }));
    },
    removeElementFromGeneratingElements: (elementId) => {
      set((state) => ({
        generatingElements: state.generatingElements.filter(
          (id) => id !== elementId,
        ),
      }));
    },
    isElementGenerating: (elementId) => {
      return get().generatingElements.includes(elementId);
    },
    reset: () => set(() => ({ ...initalState })),
  }),
);

export default useWorkbenchGenerationStatus;
