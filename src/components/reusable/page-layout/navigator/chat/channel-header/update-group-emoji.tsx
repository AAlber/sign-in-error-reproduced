import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import ChannelEmoji from "../channel-list/channel-emoji";
import useChat from "../zustand";
import { useChannelHeaderContext } from ".";

const UpdateGroupEmoji = () => {
  const { isSearching, setIsSearching } = useChat();
  const { channel } = useChannelHeaderContext();
  const [open, setOpen] = useState(false);

  const image = channel.data?.image;

  const hasPermission =
    channel.data?.own_capabilities?.includes("update-channel");

  const handleOnSelect = async (data: any) => {
    setOpen(false);
    try {
      if (isSearching) setIsSearching(false);
      await channel?.updatePartial({
        set: { image: `emoji:${data.unified}` },
      });
      await channel
        .sendMessage({
          type: "system",
          systemMessageType: "channel.update.image",
          text: data.native,
        })
        .catch(console.log);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={!hasPermission}
        className="transition-opacity hover:opacity-80"
      >
        <ChannelEmoji image={image} mode="list" />
      </PopoverTrigger>
      <PopoverContent
        className="!border-0 !p-0"
        side="right"
        sideOffset={-10}
        alignOffset={20}
        align="start"
        asChild
      >
        <div
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Picker
            data={data}
            emojiButtonSize={30}
            emojiSize={15}
            onEmojiSelect={handleOnSelect}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateGroupEmoji;
