import clsx from "clsx";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createChannelNameFromGroup } from "@/src/client-functions/client-chat";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import useChat from "../zustand";
import { useChannelHeaderContext } from ".";

const RenameChannel = () => {
  const { channel } = useChannelHeaderContext();
  const { isSearching, setIsSearching } = useChat();
  const { t } = useTranslation("page");
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const members = channel.state.members;
  const name =
    channel.data?.name === "unnamed_group" && !!members
      ? createChannelNameFromGroup(members)
      : channel.data?.name;

  const handleOpen = (bool: boolean) => {
    setOpen(bool);
  };

  const canUpdateName =
    channel.data?.own_capabilities?.includes("update-channel");

  const isCourseChat = channel.type === "course";

  const handleRename = async () => {
    if (!!value) {
      try {
        if (isSearching) setIsSearching(false);
        await channel.updatePartial({ set: { name: value } });
        await channel.sendMessage({
          systemMessageType: "channel.update.name",
          type: "system",
        });
      } catch (e) {
        console.log(e);
      }
    }

    handleOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger
        className={clsx(
          "flex items-center space-x-2 transition-colors hover:text-muted-contrast",
          !canUpdateName && !isCourseChat && "cursor-default",
        )}
        onClick={(e) => {
          if (canUpdateName && !isCourseChat) {
            e.stopPropagation();
            setOpen(true);
          }
        }}
      >
        <span className="text-contrast">{name}</span>
        {!isCourseChat && (
          <EditIcon
            size={13}
            // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
            className="relative -top-[1px] text-muted-contrast"
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={-5}
        className="min-w-[300px] space-y-4 p-2"
      >
        <div className="space-y-2">
          <span className="text-sm text-muted-contrast">
            {t("chat.group_settings_rename_placeholder")}:
          </span>
          <Input
            placeholder={name}
            value={value}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleRename();
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant={"default"}
            onClick={() => {
              handleOpen(false);
            }}
          >
            {t("general.cancel")}
          </Button>
          <Button variant={"positive"} onClick={handleRename}>
            {t("general.confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RenameChannel;
