import React, { useEffect } from "react";
import useAutoLessonChat from "../zustand";
import ChapterButton from "./chapter-button";

export default function ChapterSteps() {
  const {
    userStatus,
    chapterConfettiId,
    block,
    currentChapter,
    setCurrentChapter,
  } = useAutoLessonChat();

  useEffect(() => {
    setCurrentChapter(0);
  }, []);

  const isCurrentChapter = (index) => {
    return index === currentChapter;
  };

  return (
    <div className="flex w-full flex-col">
      {block.specs.chapters.map((chapter, index) => (
        <ChapterButton
          key={index}
          chapter={chapter}
          index={index}
          isCurrentChapter={isCurrentChapter}
          chapterConfettiId={chapterConfettiId}
          setCurrentChapter={setCurrentChapter}
          userStatus={userStatus}
        />
      ))}
    </div>
  );
}
