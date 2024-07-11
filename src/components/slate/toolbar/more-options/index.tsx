import { PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import {
  Dialog,
  DialogContent,
} from "@/src/components/reusable/shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import { toolsIcon, toolsIconContainerStyle } from "../../styles";
import MenuItemFile from "./file";
import MenuItemPoll from "./poll";
import CreatePoll from "./poll/create-poll";

export default function MoreOptions() {
  const [pollDialogOpen, setPollDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Dialog open={pollDialogOpen} onOpenChange={setPollDialogOpen}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          className={classNames(
            toolsIcon,
            "flex h-full items-center space-x-1",
          )}
        >
          <div className={toolsIconContainerStyle}>
            <PlusCircleIcon className="h-4 w-4" />
          </div>
          <Separator
            orientation="vertical"
            className="relative left-[3px] h-5 !w-[1px]"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="[&>div]:cursor-pointer">
          <MenuItemPoll />
          <MenuItemFile setMenuOpen={setMenuOpen} />
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <CreatePoll setDialogOpen={setPollDialogOpen} />
      </DialogContent>
    </Dialog>
  );
}
