import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Suggestion = {
  id: string;
  icon: string;
  name: string;
  value: string;
  specialAccess: boolean;
};

interface Suggestions {
  suggestions: Suggestion[];
  setSuggestions: (suggestions: Suggestion[]) => void;
  addSuggestion: (suggestion: Suggestion) => void;
}

const useSuggestions = create<Suggestions>()(
  persist(
    (set) => ({
      suggestions: [],
      setSuggestions: (suggestions) => set({ suggestions }),
      addSuggestion: (suggestion) => {
        set((state) => ({
          suggestions: [
            suggestion,
            ...state.suggestions.filter((s) => s.id !== suggestion.id),
          ].slice(0, 3),
        }));
      },
    }),
    {
      name: "quick-actions-suggestions",
    },
  ),
);

export default useSuggestions;
