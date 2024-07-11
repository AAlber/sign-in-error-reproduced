import { create } from "zustand";
import type { AutoLessonChapter as AutoLessonChapter } from "@/src/types/ai/ai-request-response.types";

type CustomFormAutoLesson = {
  chapters: AutoLessonChapter[];
  setChapters: (subtopics: AutoLessonChapter[]) => void;
  fileUrls: string[];
  setFileUrls: (fileUrls: string[]) => void;
  tryAgainLoading: boolean;
  setTryAgainLoading: (loading: boolean) => void;
};

const initialData = {
  chapters: [] as AutoLessonChapter[],
  fileUrls: [] as string[],
  tryAgainLoading: false,
};

const useCustomFormAutoLesson = create<CustomFormAutoLesson>((set) => ({
  ...initialData,
  setChapters: (subtopics) => set({ chapters: subtopics }),
  setFileUrls: (fileUrls) => set({ fileUrls }),
  setTryAgainLoading: (loading) => set({ tryAgainLoading: loading }),
}));

export default useCustomFormAutoLesson;
