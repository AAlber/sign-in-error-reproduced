import { Check, Lock } from "lucide-react";
import { useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import Skeleton from "@/src/components/skeleton";
import type { ContentBlock } from "@/src/types/course.types";
import type { LearningJourneyState } from "@/src/types/learning-journey.types";
import { BlockNewBadge } from "./new-badge";

export const LearningItemStyle = ({
  state,
  children,
  loading,
  disabled,
  block,
}: {
  state: LearningJourneyState;
  children: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
  block: ContentBlock | null;
}) => {
  const [clicking, setClicking] = useState(false);

  return (
    <div
      onMouseDown={() => setClicking(true)}
      onMouseUp={() => setClicking(false)}
      className={classNames(
        "relative flex cursor-pointer items-center justify-center",
        disabled && "cursor-not-allowed",
      )}
    >
      {!loading && (
        <div
          className={classNames(
            "absolute z-30 transition-all duration-200 ease-out",
            clicking ? "top-1.5" : "-top-2",
          )}
        >
          {["locked", "upcoming-or-ended"].includes(state) ? (
            <Lock size={16} className="text-muted-contrast" />
          ) : (
            ["completed"].includes(state) ? (
              <Check size={16} className="text-positive" />
            ) : (
              children
            )
          )}
        </div>
      )}

      <div
        style={{ transform: "rotateX(35deg)" }}
        className={classNames(
          "absolute z-20 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-foreground transition-all border border-border duration-200 ease-out dark:bg-muted dark:brightness-150",
          clicking && "mt-7",
        )}
      >
        {loading && (
          <div className="size-full">
            <Skeleton />
          </div>
        )}
      </div>

      <>
        {" "}
        <div
          style={{ transform: "rotateX(35deg)" }}
          className={classNames(
            "absolute z-10 h-[75px] w-16 rounded-full border-muted-contrast/30 bg-muted/80 transition-all duration-200 ease-out dark:bg-muted/60 dark:brightness-125",
            clicking ? "mt-7 h-16" : "mt-3 h-[75px]",
          )}
        ></div>
        <div
          style={{ transform: "rotateX(35deg)" }}
          className={classNames(
            "absolute mt-7 h-20 w-20 rounded-full border-2 bg-foreground",
            state === "unlocked" ? "border-primary" : "border-transparent",
          )}
        ></div>
        {state === "unlocked" && (
          <div
            style={{ transform: "rotateX(35deg)" }}
            className={classNames(
              "absolute mt-14 h-20 w-20 rounded-full bg-primary opacity-40 blur-2xl",
            )}
          ></div>
        )}
      </>
      <div className="absolute top-14 flex">
        {block && <BlockNewBadge block={block} />}
      </div>
    </div>
  );
};
