import classNames from "@/src/client-functions/client-utils";
import type { ContentBlock } from "@/src/types/course.types";
import type {
  LearningJourneyAlignment,
  LearningJourneyState,
} from "@/src/types/learning-journey.types";
import { LearningItemContentWrapper } from "./laerning-item-content-wrapper";
import { LearningItemStyle } from "./learning-item-style";

type LearningJourneyItemProps = {
  align: LearningJourneyAlignment;
  state: LearningJourneyState;
  block: ContentBlock | null;
  children?: React.ReactNode;
  loading: boolean;
  userStatusLoading: boolean;
  disabled?: boolean;
};

export const LearningJourneyItem = ({
  align,
  state,
  children,
  block,
  loading,
  userStatusLoading,
  disabled,
}: LearningJourneyItemProps) => {
  return (
    <div
      className={classNames(
        "relative flex h-28 w-96 items-center",
        align === "far-left" && "justify-start",
        align === "left" && "justify-start pl-10",
        align === "center" && "justify-center",
        align === "right" && "justify-end pr-10",
        align === "far-right" && "justify-end",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {!block && (
        <>
          <LearningItemStyle
            state={state}
            loading={loading || userStatusLoading}
            disabled={disabled}
            block={null}
          >
            {children}
          </LearningItemStyle>
          <div className="relative w-52"></div>
        </>
      )}
      {block && (
        <LearningItemContentWrapper
          block={block}
          disabled={disabled!}
          state={state}
          loading={loading}
        >
          <LearningItemStyle
            state={state}
            loading={loading || userStatusLoading}
            disabled={disabled}
            block={block}
          >
            {children}
          </LearningItemStyle>
        </LearningItemContentWrapper>
      )}
    </div>
  );
};
