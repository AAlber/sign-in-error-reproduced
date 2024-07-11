import cuid from "cuid";
import type { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import type {
  Poll,
  PollReducerActions,
  PollReducerOperation,
  SubmitPollArgs,
} from "@/src/types/chat/polls";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";

/**
 * Polls Reducer operations for optimistic updates. This functino will be passed to a useImmerReducer hook
 * get instant UI feedback onClick of an option e.g. dont wait for response to return before reflecting in UI
 *
 * accepts a draft object which will come from immer, so we can
 * safely directly mutate object here
 */
export function pollsReducer(draft: Poll, action: PollReducerActions) {
  const createNewVoteFromOption = (id: string) => {
    if (!draft?.own_votes) return draft;

    const option = draft.options.find((i) => i.id === id)!;

    draft.own_votes.push({
      created_at: option.created_at,
      id: cuid(), // temporary ID until async fetch completes
      is_answer: false,
      poll_id: draft.id,
      user_id: useUser.getState().user.id,
      option_id: option.id,
    });

    draft.vote_count++;
    draft.vote_counts_by_option = {
      ...draft.vote_counts_by_option,
      [id]: (draft.vote_counts_by_option[id] ?? 0) + 1,
    };
  };

  const removeOptionFromVotes = (optionIdToRemove: string) => {
    if (!draft?.own_votes) return draft;

    draft.own_votes.splice(
      draft.own_votes.findIndex(
        ({ option_id }) => option_id === optionIdToRemove,
      ),
      1,
    );

    draft.vote_count--;
    draft.vote_counts_by_option = {
      ...draft.vote_counts_by_option,
      [optionIdToRemove]: Math.max(
        (draft.vote_counts_by_option[optionIdToRemove] ?? 0) - 1,
        0,
      ),
    };
  };

  switch (action.type) {
    case "addVote": {
      createNewVoteFromOption(action.optionId);
      break;
    }
    case "removeVote": {
      removeOptionFromVotes(action.optionId);
      break;
    }
    case "replaceVote": {
      removeOptionFromVotes(action.removeOptionId);
      createNewVoteFromOption(action.addOptionId);
      break;
    }
    case "initVotes": {
      return action.value;
    }
    default: {
      return draft;
    }
  }
}

export async function submitVote(
  args: CommonOperationArgs & {
    operation: PollReducerOperation;
  },
) {
  try {
    log.info("Submitting vote to poll", args);
    const { dispatch, operation, optionId } = args;

    switch (operation) {
      case "removeVote": {
        return _removeVote(args);
      }
      case "replaceVote": {
        await _replaceVote(args);
        break;
      }
      case "addVote": {
        dispatch({ type: "addVote", optionId });
        break;
      }
    }

    // after replaceVote or addVote operation, make the actual vote to getstream api
    await _addVote(args);
  } catch (e) {
    log.error(e);
    throw new Error("Error updating Vote");
  }
}

/** used by form handleSubmit in UI component */
export async function submitPoll({
  onSubmit,
  currentChannel,
  getstreamClient,
  value,
}: SubmitPollArgs) {
  log.info("getStreamClient: creating new poll", { value });

  onSubmit();

  // https://getstream.io/chat/docs/javascript/polls_api/?language=javascript
  const result = await getstreamClient.createPoll({
    name: value.question,
    options: value.options,
    max_votes_allowed: value.allowMultiple ? undefined : 1,
  });

  await currentChannel.sendMessage(
    { text: value.question, poll_id: result.poll.id },
    {},
  );
}

/** Private operations below */

async function _refetchMessageAndUpdateState(args: {
  messageId: string;
  streamClient: StreamChat<StreamChatGenerics>;
  dispatch: React.Dispatch<PollReducerActions>;
}) {
  const { dispatch, messageId, streamClient } = args;
  const result = await streamClient.getMessage(messageId);
  dispatch({
    type: "initVotes",
    value: result.message.poll,
  });
}

async function _removePollVote(
  args: Omit<CommonOperationArgs, "dispatch" | "optionId"> & {
    voteIdToRemove?: string;
  },
) {
  const { messageId, poll, streamClient, voteIdToRemove } = args;
  if (!voteIdToRemove || !poll?.id) return;

  await streamClient.removePollVote(messageId, poll.id, voteIdToRemove);

  return await streamClient.getPoll(poll.id, useUser.getState().user.id);
}

type CommonOperationArgs = {
  messageId: string;
  streamClient: StreamChat<StreamChatGenerics>;
  poll: Poll;
  optionId: string;
  dispatch: React.Dispatch<PollReducerActions>;
};

async function _replaceVote(args: CommonOperationArgs) {
  const { poll, dispatch, optionId } = args;

  if (!poll) return;

  const vote = poll.own_votes?.[0];
  if (!vote?.option_id) return;

  dispatch({
    type: "replaceVote",
    removeOptionId: vote.option_id,
    addOptionId: optionId,
  });
  await _removePollVote({ ...args, voteIdToRemove: vote.id });
}

async function _removeVote(args: CommonOperationArgs) {
  const { dispatch, poll, optionId } = args;
  if (!poll) throw new Error("Missing poll");

  dispatch({ type: "removeVote", optionId });
  const voteToRemove = poll.own_votes?.find((i) => i.option_id === optionId);

  await _removePollVote({
    ...args,
    voteIdToRemove: voteToRemove?.id,
  });

  await _refetchMessageAndUpdateState(args);
}

async function _addVote({
  dispatch,
  optionId,
  streamClient,
  messageId,
  poll,
}: CommonOperationArgs) {
  if (!poll) throw new Error("Missing poll");

  await streamClient.castPollVote(messageId, poll.id, {
    option_id: optionId,
  });

  await _refetchMessageAndUpdateState({
    messageId,
    streamClient,
    dispatch,
  });
}
