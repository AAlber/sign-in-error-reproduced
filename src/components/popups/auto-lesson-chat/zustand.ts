import { create } from "zustand";
import type { ContentBlockUserStatusOfUser } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";

interface AutoLessonChat {
  loadingThread: boolean;
  open: boolean;
  popoverOpen: boolean;
  blockId: string;
  currentChapter: number;
  nextChapterId: string;
  chapterConfettiId: string;
  selectedAnswer: { question: string; text: string; isCorrect: boolean } | null;
  triggerConfetti: (chapterId: string) => void;
  setCurrentChapter: (number: number) => void;
  block: ContentBlock<"AutoLesson">;
  userStatus: ContentBlockUserStatusOfUser<"AutoLesson">;
  autoScroll: boolean;
  setOpen: (data: boolean) => void;
  openChat: (data: {
    block: ContentBlock<"AutoLesson">;
    userStatus: ContentBlockUserStatusOfUser<"AutoLesson">;
  }) => void;
  updateUserStatus: (data: ContentBlockUserStatusOfUser<"AutoLesson">) => void;
  setLoadingThread: (loading: boolean) => void;
  setPopoverOpen: (data: boolean) => void;
  setNextChapterId: (id: string) => void;
  setSelectedAnswer: (
    data: { question: string; text: string; isCorrect: boolean } | null,
  ) => void;
  setAutoScroll: (data: boolean) => void;
  reset: () => void;
}

const initalState = {
  open: false,
  currentChapter: 0,
  loadingThread: false,
  popoverOpen: false,
  blockId: "",
  nextChapterId: "",
  selectedAnswer: { question: "", text: "", isCorrect: false },
  userDataStatus: "",
  chapterConfettiId: "",
  userStatus: {
    status: "NOT_STARTED",
  } as ContentBlockUserStatusOfUser<"AutoLesson">,
  block: null as unknown as ContentBlock<"AutoLesson">,
  autoScroll: true,
};

const useAutoLessonChat = create<AutoLessonChat>((set) => ({
  ...initalState,

  reset: () => set(() => ({ ...initalState })),
  setOpen: (data) => set(() => ({ open: data })),
  openChat: (data) => set(() => ({ ...data, open: true })),
  setCurrentChapter: (number) => set(() => ({ currentChapter: number })),
  updateUserStatus: (data) => set(() => ({ userStatus: data })),
  setLoadingThread: (loading) => set(() => ({ loadingThread: loading })),
  setNextChapterId: (id) => set(() => ({ nextChapterId: id })),
  setPopoverOpen: (data) => set(() => ({ popoverOpen: data })),
  setSelectedAnswer: (data) => set(() => ({ selectedAnswer: data })),
  triggerConfetti: (chapterId) =>
    set(() => ({
      chapterConfettiId: chapterId,
    })),
  setAutoScroll: (data) => set(() => ({ autoScroll: data })),
}));

export default useAutoLessonChat;
