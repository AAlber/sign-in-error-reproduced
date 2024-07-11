import type { UseAssistantHelpers } from "ai/react";
import { Bot, Check, Lock } from "lucide-react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { AutoLessonUserData } from "@/src/types/content-block/types/user-data.types";
import useAutoLessonChat from "./zustand";

// checks if the chapter has been unlocked by gthe user or not
export function hasUnlockedChapter(userStatus, id) {
  // if the chapters array is empty, return false (chapter has not been unlocked)
  if (userStatus.userData?.chapters.length === 0) return false;
  // else return true (chapter has been unlocked)
  return userStatus.userData?.chapters.find((c) => c.chapterId === id)
    ?.unlocked;
}

// checks if the chapter has been finished by the user or not
export function hasFinishedChapter(userStatus, id) {
  // if the chapters array is empty, return false (chapter has not been finished)
  if (userStatus.userData?.chapters.length === 0) return false;
  // else return true (chapter has been finished)
  return userStatus.userData?.chapters.find((c) => c.chapterId === id)
    ?.finished;
}

// returns the icon for the chapter status
export function getChapterStatusIcon(userStatus, chapterId) {
  // if the chapter has not been unlocked yet
  if (!hasUnlockedChapter(userStatus, chapterId)) {
    return <Lock className="size-4 text-muted-contrast" />;
  }
  // if the chapter has been finished
  if (hasFinishedChapter(userStatus, chapterId)) {
    return <Check className="size-4 text-positive" />;
  }
  // current chapter
  return <Bot className="size-4 text-contrast" />;
}

// checks if the assistant is loading
export function isLoading(assistant: UseAssistantHelpers) {
  if (!assistant) return false;
  return (
    assistant.status === "in_progress" &&
    assistant.messages[assistant.messages.length - 1]?.role === "user"
  );
}

export function isAssistantStreaming(assistant: UseAssistantHelpers) {
  if (!assistant) return false;
  const lastMessage = assistant.messages[assistant.messages.length - 1];
  return (
    assistant.status === "in_progress" && lastMessage?.role === "assistant"
  );
}

// handels the end of the chapters when all is finished by the users and closes the modal
export function finishBlock() {
  const { userStatus, block, setOpen, triggerConfetti } =
    useAutoLessonChat.getState();
  const finishedChapters = userStatus.userData!.chapters.map((c: any) => ({
    ...c,
    finished: true,
  }));

  contentBlockHandler.userStatus.finish<"AutoLesson">(block.id, {
    chapters: finishedChapters,
  });

  triggerConfetti(block.id);
  setOpen(false);
}

// checks wether the chapter is
function getUpdatedChaptersBasedOnNextChapter(
  chapters: AutoLessonUserData["chapters"],
  nextChapterId: string,
) {
  return chapters.map((c) => {
    if (nextChapterId === c.chapterId) {
      return {
        chapterId: c.chapterId,
        unlocked: true,
        finished: false,
        threadId: c.threadId,
      };
    } else if (c.unlocked === true && nextChapterId !== c.chapterId) {
      return {
        chapterId: c.chapterId,
        unlocked: true,
        finished: true,
        threadId: c.threadId,
      };
    } else {
      return c;
    }
  });
}

function updateUserData() {
  const {
    triggerConfetti,
    updateUserStatus,
    currentChapter,
    setCurrentChapter,
    userStatus,
    nextChapterId,
    block,
  } = useAutoLessonChat.getState();

  const newUserData = {
    chapters: getUpdatedChaptersBasedOnNextChapter(
      userStatus.userData!.chapters,
      nextChapterId,
    ),
  };

  setTimeout(() => triggerConfetti(nextChapterId), 50);

  contentBlockHandler.userStatus.update<"AutoLesson">({
    blockId: block.id,
    data: { userData: newUserData },
  });

  updateUserStatus({ status: "IN_PROGRESS", userData: newUserData });
  setCurrentChapter(currentChapter + 1);
}

export function handleIncorrectAnswer(assistant: UseAssistantHelpers) {
  const { selectedAnswer } = useAutoLessonChat.getState();

  assistant.append({
    role: "assistant",
    content:
      "Oh this answer is not correct. You answered the question: " +
      selectedAnswer?.question +
      ",  with + " +
      selectedAnswer?.text +
      ". Here is a explanation of the correct answer:",
  });
}

export function handleSubmit(assistant: UseAssistantHelpers) {
  const { setPopoverOpen, nextChapterId, selectedAnswer } =
    useAutoLessonChat.getState();
  if (!selectedAnswer) return;

  setPopoverOpen(false);

  if (!selectedAnswer.isCorrect) {
    handleIncorrectAnswer(assistant);
    return;
  }

  if (!nextChapterId) {
    finishBlock();
    return;
  }

  updateUserData();
}
