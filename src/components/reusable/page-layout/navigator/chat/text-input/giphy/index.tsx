import { GifIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import {
  toolbarActive,
  toolsIcon,
  toolsIconContainerStyle,
} from "@/src/components/slate";
import Giphy from "./giphy-button";

const GiphyButton = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string | undefined>();

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        if (!open) setSearch("");
      }}
    >
      <PopoverTrigger className={clsx(toolsIconContainerStyle, toolbarActive)}>
        <GifIcon className={clsx(toolsIcon, "h-5 w-5")} />
      </PopoverTrigger>
      <PopoverContent className="!m-0 w-auto !p-2" align="end">
        <Giphy setOpen={setOpen} search={search} setSearch={setSearch} />
      </PopoverContent>
    </Popover>
  );
};

export default GiphyButton;
