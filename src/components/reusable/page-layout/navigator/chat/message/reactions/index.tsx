import data from "@emoji-mart/data";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import type { UserResponse } from "stream-chat";
import {
  type StreamMessage,
  useChatContext,
  useMessageContext,
} from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";
import getReactions from "./get-reactions";
import SingleReaction from "./single-reaction";

type ReactionWithUserDetails = {
  [reactionType: string]: UserResponse<StreamChatGenerics>[];
};

interface MessageReactionProps {
  message: StreamMessage<StreamChatGenerics>;
}

const MessageReactions: React.FC<MessageReactionProps> = (props) => {
  const { channel } = useChatContext<StreamChatGenerics>();
  const { user: user } = useUser();
  const [loaded, setIsLoaded] = useState(false);
  const [reactionWithUsers, setReactionWithUsers] =
    useState<ReactionWithUserDetails>({});

  const { isMyMessage } = useMessageContext<StreamChatGenerics>();

  const msgFromState = useMemo(
    () => channel?.state.messages.find((i) => i.id === props.message.id),
    [channel?.state.messages, props.message],
  );

  const reactions = useMemo(() => {
    const reactions = getReactions(msgFromState);
    const withUserDetails = Object.entries(reactionWithUsers);

    const reactionsWithUserDetails = reactions.map((reaction) => {
      const newReaction = { ...reaction };
      const foundType = withUserDetails.find(
        ([type]) => type === reaction.type,
      );
      if (!foundType) return reaction;
      const [_, users] = foundType;
      const otherUsers = users.filter((u) => u.id !== user.id);
      newReaction.users = otherUsers;

      return newReaction;
    });

    return reactionsWithUserDetails;
  }, [msgFromState, reactionWithUsers]);

  useEffect(() => {
    const init = async () => {
      const lib = await import("emoji-mart");
      lib?.init({ data }).then(() => {
        setIsLoaded(true);
      });
    };
    init();
  }, []);

  /**
   * On mount fetch reactions with user data included
   */

  useEffect(() => {
    async function fetchDetailedReactions() {
      if (!channel?.getReactions) return;

      const { reactions } = await channel.getReactions(props.message.id, {
        limit: 100,
        offset: 0,
      });

      const reactionsWithUserDetails =
        reactions.reduce<ReactionWithUserDetails>((p, c) => {
          if (!c.user || !c.type) return p;

          const existing = p[c.type];
          return {
            ...p,
            [c.type]: !!existing ? [...existing, c.user] : [c.user],
          };
        }, {});

      setReactionWithUsers(reactionsWithUserDetails);
    }

    fetchDetailedReactions().catch(console.log);
  }, [channel]);

  const handleClick = async (reaction: string, isOwnReaction: boolean) => {
    // custom meta as getstream only accepts reaction type of max 30chars
    const emojiId = reaction.substring(0, 30);

    try {
      if (isOwnReaction) {
        await channel?.deleteReaction(props.message.id, emojiId);
      } else {
        const data = {
          type: reaction.substring(0, 30),
          user_id: user.id,
          emoji_id: reaction,
        };
        await channel?.sendReaction(props.message.id, data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!loaded) return null;
  return (
    <div
      className={clsx(
        "message-reactions relative -top-[10px] flex flex-wrap gap-1",
        isMyMessage() ? "mr-1 justify-end" : "ml-14",
      )}
    >
      {reactions
        .sort((a, b) => b.count - a.count)
        .map((i) => (
          <SingleReaction key={i.type} onClick={handleClick} reaction={i} />
        ))}
    </div>
  );
};

export default React.memo(MessageReactions);
