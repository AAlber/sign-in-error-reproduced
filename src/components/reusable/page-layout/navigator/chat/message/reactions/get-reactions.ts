import type { DefaultGenerics, UserResponse } from "stream-chat";
import { messageHasReactions, type StreamMessage } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";

export type ReactionType = {
  type: string;
  count: number;
  hasOwnReaction: boolean;
  users: UserResponse<StreamChatGenerics>[];
};

export default function getReactions<T extends DefaultGenerics>(
  message: StreamMessage<T> | undefined,
) {
  const hasReactions = messageHasReactions<T>(message);
  let reactions: ReactionType[] = [];

  if (hasReactions) {
    if (message?.reaction_counts) {
      const myReactions = message.own_reactions?.map((i) => i.type);
      reactions = Object.entries(message.reaction_counts).map(
        ([type, count]) => ({
          type,
          count,
          hasOwnReaction: myReactions?.includes(type) ?? false,
          users: [],
        }),
      );
    }
  }

  return reactions;
}
