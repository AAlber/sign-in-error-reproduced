import classNames from "@/src/client-functions/client-utils";
import type { ContentBlock } from "@/src/types/course.types";
import type { LearningJourneyState } from "@/src/types/learning-journey.types";

export const LearningItemInfo = ({
  block,
  state,
  loading,
}: {
  block: ContentBlock;
  state: LearningJourneyState;
  loading: boolean;
}) => {
  return (
    <div
      className={classNames(
        "flex w-52 items-center gap-2 pt-2",
        loading && "opacity-0",
      )}
    >
      <div className="w-16" />
      <div className="relative flex flex-col">
        <span className="text-xs text-muted-contrast">{block.type}</span>
        <span
          className={classNames(
            "text-sm font-medium text-contrast",
            state === "locked" || state === "upcoming-or-ended"
              ? "text-muted-contrast"
              : "text-contrast",
          )}
        >
          {block.name}
        </span>
      </div>
    </div>
  );
};
