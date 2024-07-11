import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { SmilePlus } from "lucide-react";
import React from "react";
import { useMessageContext } from "stream-chat-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { StreamChatGenerics } from "../../types";

const MoreReactions = () => {
  const { handleReaction } = useMessageContext<StreamChatGenerics>();
  const handleSelect = (type: { id: string }) => {
    handleReaction(type.id, {} as any);
  };

  return (
    <Popover>
      <PopoverTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-center transition-transform  hover:bg-accent/50 active:scale-90">
        <SmilePlus size={17} />
      </PopoverTrigger>
      <PopoverContent className="!m-0 !p-0">
        <EmojiPicker
          data={data}
          emojiButtonSize={30}
          emojiSize={20}
          onEmojiSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MoreReactions;
