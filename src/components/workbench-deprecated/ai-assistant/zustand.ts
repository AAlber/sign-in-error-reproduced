import { create } from "zustand";

interface AIAssistant {
  open: boolean;
  setOpen: (data: boolean) => void;
  selectedTags: string[];
  setSelectedTags: (data: string[]) => void;
  difficulty: number;
  setDifficulty: (data: number) => void;
  type: "section" | "page";
  setType: (data: "section" | "page") => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
  promptOrigin: PromptOrigin;
  setPromptOrigin: (data: PromptOrigin) => void;
  prompt: string;
  setPrompt: (data: string) => void;
  language: Language;
  setLanguage: (data: Language) => void;

  file: File | null;
  setFile: (data: File | null) => void;
  reset: () => void;
}

export enum PromptOrigin {
  CURRENT_PAGE,
  PDF,
  TEXT,
}

const initalState = {
  open: false,
  selectedTags: [],
  difficulty: 5,
  type: "section" as "section" | "page",
  language: "en" as Language,
  loading: false,
  promptOrigin: PromptOrigin.TEXT,
  prompt: "",
  file: null,
};

export const useAIAssistant = create<AIAssistant>((set) => ({
  ...initalState,
  setFile: (data: File | null) => set({ file: data }),
  setLoading: (data: boolean) => set({ loading: data }),
  setSelectedTags: (data: string[]) => set({ selectedTags: data }),
  setDifficulty: (data: number) => set({ difficulty: data }),
  setType: (data: "section" | "page") => set({ type: data }),
  setPromptOrigin: (data: PromptOrigin) => set({ promptOrigin: data }),
  setPrompt: (data: string) => set({ prompt: data }),
  setLanguage: (data: Language) => set({ language: data }),
  setOpen: (data: boolean) => set({ open: data }),
  reset: () => set({ ...initalState }),
}));
