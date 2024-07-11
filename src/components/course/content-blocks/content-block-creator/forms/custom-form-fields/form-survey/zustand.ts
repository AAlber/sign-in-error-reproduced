import { create } from "zustand";
import type { SurveyQuestion } from "@/src/types/survey.types";

type QuestionType = "selection" | "text";

type CustomFormSurveyState = {
  questions: SurveyQuestion[];
  setQuestions: (questions: SurveyQuestion[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  removeQuestion: (questionId: string) => void;
};

const initialData = {
  questions: [] as SurveyQuestion[],
  open: false,
};

const useCustomFormSurvey = create<CustomFormSurveyState>((set) => ({
  ...initialData,
  setQuestions: (questions) => set({ questions }),
  setOpen: (open) => set({ open }),
  removeQuestion: (questionId) => {
    set((state) => ({
      questions: state.questions.filter(
        (question) => question.id !== questionId,
      ),
    }));
  },
}));

export default useCustomFormSurvey;
