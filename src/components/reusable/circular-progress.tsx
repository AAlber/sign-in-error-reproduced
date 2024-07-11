import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";

type CircularProgressProps = {
  progress: number;
  animateFrom?: number;
  className?: string;
  textClassName?: string;
  finishedComponent?: React.ReactNode;
  strokeWidth?: number;
};

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  animateFrom,
  className,
  textClassName,
  finishedComponent,
  strokeWidth = 8,
}) => {
  const [currentProgress, setProgress] = useState<number>(
    animateFrom || progress,
  );
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokePercent = (currentProgress / 100) * circumference;

  // Adjusting for the gap between filled and unfilled bars
  const gapSize = currentProgress === 0 ? 0 : 0.02 * circumference; // 5% of circumference
  const unfilledGap =
    ((100 - currentProgress) / 100) * circumference - 2 * gapSize;

  useEffect(() => {
    if (!animateFrom) return;
    setTimeout(() => {
      setProgress(progress);
    }, 0);
  }, [animateFrom]);

  return (
    <div className={classNames("relative h-16 w-16", className)}>
      <svg
        className="h-full w-full rotate-[-85deg]"
        fill="none"
        viewBox="0 0 100 100"
      >
        {currentProgress > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={classNames(
              "stroke-primary transition-all duration-1000 ease-out",
              currentProgress < 100 ? "text-primary" : "text-positive",
            )}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${strokePercent} ${circumference}`}
            strokeDashoffset="0"
          ></circle>
        )}
        {currentProgress < 91 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-border text-muted transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${unfilledGap} ${circumference}`}
            strokeDashoffset={`${-strokePercent - gapSize}`}
          ></circle>
        )}
      </svg>
      <p
        className={classNames(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-contrast",
          textClassName,
        )}
      >
        {currentProgress === 100 ? (
          <>
            {!finishedComponent ? (
              <Check className="w-h h-5 text-positive" />
            ) : (
              <>{finishedComponent}</>
            )}
          </>
        ) : (
          Math.round(progress) + "%"
        )}
      </p>
    </div>
  );
};

export default CircularProgress;
