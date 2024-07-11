import React from "react";
import ConfettiExplosion from "react-confetti-explosion";

const FinishedChapterConfetti = ({ chapter, chapterConfettiId }) => {
  return (
    <>
      {chapterConfettiId === chapter.id && (
        <ConfettiExplosion
          duration={2500}
          force={0.4}
          particleCount={100}
          zIndex={5000}
        />
      )}
    </>
  );
};

export default FinishedChapterConfetti;
