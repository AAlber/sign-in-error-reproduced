import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PollOption } from "stream-chat";
import { type StreamMessage, useChatContext } from "stream-chat-react";
import { useImmerReducer } from "use-immer";
import {
  pollsReducer,
  submitVote,
} from "@/src/client-functions/client-chat/polls";
import classNames from "@/src/client-functions/client-utils";
import type { PollReducerOperation } from "@/src/types/chat/polls";
import { log } from "@/src/utils/logger/logger";
import { filterUndefined } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../../types";
import PollItemWrapper from "./poll-item.wrapper";

type Props = {
  message: StreamMessage<StreamChatGenerics>;
};

export default function MessagePoll({ message }: Props) {
  const { client } = useChatContext<StreamChatGenerics>();
  const { t } = useTranslation("page");
  const [isLoading, setIsLoading] = useState(false);
  const [poll, dispatch] = useImmerReducer(pollsReducer, message.poll);

  const userId = useUser((state) => state.user.id);
  const isMyMessage = message.user?.id === userId;

  const votedItems = poll?.own_votes ?? [];
  const votedOptionIds = votedItems
    .map((i) => i?.option_id)
    .filter(filterUndefined);

  if (!poll) return null;
  const hasVoted = !!votedItems.length;
  const voteCount = poll.vote_count;
  const maxVotesAllowed = poll.max_votes_allowed;
  const multipleVotesAllowed = maxVotesAllowed === null || maxVotesAllowed > 1;

  const handleVote = async (optionId: string, isVoted: boolean) => {
    log.info("getStreamClient: submitting poll vote", { poll, optionId });

    setIsLoading(true);

    const operation: PollReducerOperation = isVoted
      ? "removeVote"
      : !multipleVotesAllowed
      ? voteCount
        ? "replaceVote"
        : "addVote"
      : "addVote";

    await submitVote({
      poll,
      messageId: message.id,
      optionId,
      operation,
      streamClient: client,
      dispatch,
    }).catch(log.error);

    setIsLoading(false);
  };

  return (
    <div className="mt-1 grid gap-2 text-sm">
      <p
        className={classNames(
          "text-xs dark:text-muted-contrast",
          isMyMessage ? "text-white" : "text-contrast",
        )}
      >
        {multipleVotesAllowed
          ? t("chat.poll.select_one_or_more")
          : t("chat.poll.select_one")}
      </p>
      <div className="grid min-w-72 gap-2">
        <div className="grid gap-1">
          {poll.options.map((opt) => {
            const option = opt as PollOption<StreamChatGenerics>;

            const optionVoteCount =
              option.vote_count ?? poll.vote_counts_by_option[option.id] ?? 0;
            const isVoted = votedOptionIds.includes(option.id);

            let width = Math.ceil((optionVoteCount / voteCount) * 100);
            width = isNaN(width) ? 0 : width;

            return (
              <PollItemWrapper
                key={option.id}
                hasVotes={hasVoted}
                isLoading={isLoading}
                isOptionVoted={isVoted}
                option={option}
                optionVoteCount={optionVoteCount}
                width={width}
                onClick={() => {
                  if (isLoading) return;
                  if (
                    multipleVotesAllowed &&
                    voteCount === maxVotesAllowed &&
                    !isVoted
                  ) {
                    return;
                  }
                  handleVote(option.id, isVoted);
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        className={classNames(
          "flex justify-between text-xs text-contrast dark:text-muted-contrast",
          isMyMessage ? "text-white" : "text-contrast",
        )}
      >
        <p>
          {voteCount} {t("chat.poll.votes")}
        </p>
        {!!voteCount && !hasVoted ? (
          <p>{t("chat.poll.vote_to_see_result")}</p>
        ) : null}
      </div>
    </div>
  );
}
