import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import clsx from "clsx";
import { SmileIcon } from "lucide-react";
import { useSlate } from "slate-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { toolsIcon } from "@/src/components/slate";
import type { EmojiMartData } from "../message/add-reactions";

export const EmojiSelector = () => {
  const editor = useSlate();

  const handleSelect = async (data: EmojiMartData) => {
    editor.insertNode({
      type: "emoji",
      fontSize: "22px",
      emoji: data.native,
      children: [
        {
          text: data.native,
        },
      ],
    });
  };

  return (
    <Popover>
      <PopoverTrigger className="h-5 w-5">
        <SmileIcon size={16} className={clsx(toolsIcon, "transition-colors")} />
      </PopoverTrigger>
      <PopoverContent className="!p-0" align="end">
        <Picker
          data={data}
          emojiButtonSize={30}
          emojiSize={20}
          onEmojiSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
};
