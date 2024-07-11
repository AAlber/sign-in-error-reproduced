import React, { useEffect, useState } from "react";

export default function FakeAIAssistantProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const randomNewProgress = Math.random() * 15 + 5;
        const newProgress = oldProgress + randomNewProgress;
        if (newProgress > 99) {
          clearInterval(interval);
          return 99;
        }
        return newProgress;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-8 items-center gap-2 px-2 text-contrast">
      <div className="h-2 w-full rounded-full bg-accent/50">
        <div
          className="h-2 rounded-full bg-gradient-to-tr from-primary to-primary/50 transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="w-12 text-end text-sm">{Math.round(progress)} %</div>
    </div>
  );
}
