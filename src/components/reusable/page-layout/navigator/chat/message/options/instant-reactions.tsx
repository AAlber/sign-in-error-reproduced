import React, { type SyntheticEvent } from "react";
import { useMessageContext } from "stream-chat-react";

const SingleReaction = (props: {
  type: DefaultEmojiReactions;
  emoji: string;
}) => {
  const { handleReaction } = useMessageContext();
  const handleQuickReaction =
    (type: DefaultEmojiReactions) => (e: SyntheticEvent) => {
      handleReaction(type, e);
    };

  return (
    <button
      className="h-8 w-8 rounded-md transition-transform hover:bg-accent/50 active:scale-90"
      onClick={handleQuickReaction(props.type)}
    >
      <span className="text-[15px]">{props.emoji}</span>
    </button>
  );
};

type DefaultEmojiReactions =
  | "+1" // 👍
  | "open_mouth" // 😮
  | "angry"
  | "heart"
  | "joy"
  | "pensive";

const InstantReacts = () => {
  const DefaultReactionEmojis: {
    type: DefaultEmojiReactions;
    emoji: string;
  }[] = [
    {
      type: "+1",
      emoji: "👍",
    },
    {
      type: "heart",
      emoji: "❤️",
    },
    {
      type: "joy",
      emoji: "😂",
    },
  ];

  return (
    <div>
      {DefaultReactionEmojis.map(({ emoji, type }) => (
        <SingleReaction emoji={emoji} type={type} key={type} />
      ))}
    </div>
  );
};

export default InstantReacts;
