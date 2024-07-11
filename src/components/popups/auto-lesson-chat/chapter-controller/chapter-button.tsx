import classNames from "classnames";
import { ChevronRight } from "lucide-react";
import React from "react";
import { hasUnlockedChapter } from "../functions";
import ChapterStatus from "./chapter-status";
import FinishedChapterConfetti from "./finished-chapter-confetti";
// how about ChapterSection ??
const ChapterButton = ({
  chapter,
  index,
  isCurrentChapter,
  chapterConfettiId,
  setCurrentChapter,
  userStatus,
}) => {
  return (
    <button
      key={index}
      className={classNames(
        isCurrentChapter(index) && "bg-accent/30",
        "relative flex w-full items-center justify-between gap-2 border-b border-border p-4 text-sm hover:bg-accent/30",
      )}
      disabled={!hasUnlockedChapter(userStatus, chapter.id)}
      onClick={() => setCurrentChapter(index)}
    >
      <div className="flex flex-1 items-center">
        <FinishedChapterConfetti
          chapter={chapter}
          chapterConfettiId={chapterConfettiId}
        />
        <ChapterStatus chapter={chapter} userStatus={userStatus} />
      </div>
      {hasUnlockedChapter(userStatus, chapter.id) && (
        <ChevronRight className="h-4 w-4 text-muted-contrast" />
      )}
    </button>
  );
};

export default ChapterButton;
