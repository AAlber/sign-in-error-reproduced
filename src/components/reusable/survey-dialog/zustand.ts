import { create } from "zustand";
import type {
  SurveyAnswer,
  SurveyDialogProps,
  SurveyQuestion,
} from "@/src/types/survey.types";
import type { CarouselApi } from "../shadcn-ui/carousel";

type SurveyDialogState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  carouselApi: CarouselApi;
  setCarouselApi: (api: CarouselApi) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  answers: SurveyAnswer[];
  setAnswers: (answers: SurveyAnswer[]) => void;
  closeModal: () => void;
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  questions: SurveyQuestion[];
  introPage?: React.ReactNode;
  onFinish: (answers: SurveyAnswer[]) => void | Promise<void>;
  confirmationText: string;
  textInput?: "text-area" | "input";
  init: (data: SurveyDialogProps) => void;
};

const inialState = {
  open: false,
  carouselApi: undefined,
  pageCount: 0,
  currentPage: 0,
  answers: [],
  mode: "view" as const,
  questions: [],
  introPage: undefined,
  onFinish: () => {
    console.error("onFinish not set");
  },
  confirmationText: "",
  textInput: "text-area" as const,
};

export const useSurveyDialog = create<SurveyDialogState>((set) => ({
  ...inialState,
  setOpen: (open) => set({ open }),
  setCarouselApi: (api) => set({ carouselApi: api }),
  setPageCount: (count) => set({ pageCount: count }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setAnswers: (answers) => set({ answers }),
  closeModal: () => set({ ...inialState }),
  setMode: (mode) => set({ mode }),
  init: (data) => set(data),
}));
