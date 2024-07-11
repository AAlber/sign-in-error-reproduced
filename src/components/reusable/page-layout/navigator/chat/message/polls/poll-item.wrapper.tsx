import React from "react";
import type { PollOption } from "stream-chat";
import type { StreamChatGenerics } from "../../types";
import PollItem from "./poll-item";
import PollTallyIndicator from "./poll-tally-indicator";

type Props = {
  hasVotes: boolean;
  isLoading: boolean;
  isOptionVoted: boolean;
  option: PollOption<StreamChatGenerics>;
  width: number;
  optionVoteCount: number;
  onClick: () => void;
};

export default function PollItemWrapper({
  hasVotes,
  isLoading,
  isOptionVoted,
  option,
  width,
  optionVoteCount,
  onClick,
}: Props) {
  return (
    <div
      className="relative h-[40px] w-full overflow-hidden rounded-md border border-border bg-white hover:opacity-80 dark:bg-contrast"
      onClick={onClick}
    >
      {hasVotes && (
        <PollTallyIndicator
          isLoading={isLoading}
          isVoted={isOptionVoted}
          width={width}
        />
      )}

      <PollItem
        isVoted={isOptionVoted}
        label={option.text}
        count={hasVotes ? optionVoteCount : 0}
      />
    </div>
  );
}
