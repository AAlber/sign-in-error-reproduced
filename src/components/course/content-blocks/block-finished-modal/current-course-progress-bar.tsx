import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import CircularProgress from "@/src/components/reusable/circular-progress";
import useContentBlockFinishedModal from "./zustand";

const titles = [
  "nice-one",
  "well-done",
  "good-job",
  "great-work",
  "awesome",
  "amazing",
  "incredible",
  "fantastic",
];

export const CurrentCourseProgressBar = () => {
  const { open } = useContentBlockFinishedModal();
  const [explode, setExplode] = useState(false);
  const [title, setTitle] = useState<string>("");
  const contentBlocks = learningJourneyHelper.getContentBlocks(true, true);

  const finishedBlocks = contentBlocks.filter(
    (block) =>
      block.userStatus === "FINISHED" || block.userStatus === "REVIEWED",
  );

  const percentage = Math.round(
    (finishedBlocks.length / contentBlocks.length) * 100,
  );

  useEffect(() => {
    if (!open) return setExplode(false);
    setTitle(titles[Math.floor(Math.random() * titles.length)]!);
    setTimeout(() => setExplode(true), 0);
  }, [open]);

  return (
    <div className="mt-4 flex h-48 items-center justify-center">
      {explode && (
        <ConfettiExplosion
          duration={4000}
          force={0.7}
          particleCount={200}
          zIndex={1000}
          className="absolute"
        />
      )}
      <CircularProgress
        strokeWidth={2}
        className="absolute size-48"
        progress={percentage}
        textClassName="text-4xl"
        finishedComponent={<span className="text-7xl">🎉</span>}
      />
      <CircularProgress
        strokeWidth={2}
        className="absolute size-48 blur-3xl"
        progress={percentage}
        textClassName="text-4xl"
        finishedComponent={<span className="text-7xl">🎉</span>}
      />
    </div>
  );
};
