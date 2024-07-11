import { create } from "zustand";
import type { SelectionOption } from "@/src/types/survey.types";

type QuestionType = "selection" | "text";

type CustomFormSurveyState = {
  answers: SelectionOption[];
  setAwnsers: (answers: SelectionOption[]) => void;
  questionText: string;
  setQuestionText: (questionText: string) => void;
  questionType: QuestionType;
  setQuestionType: (questionType: QuestionType) => void;
  reset: () => void;
};

const initialData = {
  answers: [] as SelectionOption[],
  questionText: "",
  questionType: "text" as QuestionType,
};

const useSurveyCreation = create<CustomFormSurveyState>((set) => ({
  ...initialData,
  setAwnsers: (answers) => set({ answers }),
  setQuestionText: (questionText) => set({ questionText }),
  setQuestionType: (questionType) => set({ questionType }),
  reset: () => set({ ...initialData }),
}));

export default useSurveyCreation;
