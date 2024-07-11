import {
  EditIcon,
  MoreHorizontal,
  PinIcon,
  PinOff,
  Trash2Icon,
} from "lucide-react";
import React, { type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  useChannelStateContext,
  useChatContext,
  useMessageContext,
} from "stream-chat-react";
import confirmAction from "@/src/client-functions/client-options-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { StreamChatGenerics } from "../../types";

const MoreOptions = (props: { onDelete: () => Promise<void> }) => {
  const { onDelete } = props;
  const { client } = useChatContext<StreamChatGenerics>();
  const { t } = useTranslation("page");
  const { channel, pinnedMessages } =
    useChannelStateContext<StreamChatGenerics>();
  const { message, handlePin, setEditingState } =
    useMessageContext<StreamChatGenerics>();

  const canPinMessage =
    !!channel.data?.own_capabilities?.includes("pin-message");

  const handleEdit = (e: SyntheticEvent) => {
    setEditingState(e);
  };

  const handlePinMessage = (e: SyntheticEvent) => {
    // toggles message pinned state
    handlePin(e);
  };

  const handlePinMessageWithModal =
    (lastPinMsgId: string) => (e: SyntheticEvent) => {
      confirmAction(
        async () => {
          await client.unpinMessage(lastPinMsgId);
          handlePin(e);
        },
        {
          actionName: t("general.yes"),
          description: "",
          title: t("chat.options.pin_message.replace_warning"),
        },
      );
    };

  const lastPinnedMessage = pinnedMessages?.at(-1);

  /**
   * Using a popover component seems to be more stable compared to
   * using dropdown menu due to a mouse click event bug when
   * wrapping a dropdown menu with the hovercard component
   */
  return (
    <Popover>
      <PopoverTrigger className="!ml-0 flex h-8 w-8 items-center justify-center rounded-md text-center transition-transform  hover:bg-accent/50 active:scale-90">
        <MoreHorizontal size={18} />
      </PopoverTrigger>
      <PopoverContent
        asChild
        className="!w-auto !p-1"
        side="bottom"
        align="end"
        sideOffset={-4}
        alignOffset={-8}
      >
        <ul className="text-sm">
          {canPinMessage && (
            <li className="rounded-sm px-2 py-1 hover:bg-accent/50">
              {!lastPinnedMessage ? (
                <button
                  className="flex w-full items-center space-x-2 text-left"
                  onClick={handlePinMessage}
                >
                  <PinIcon size={15} />
                  <span>{t("chat.options.pin_message")}</span>
                </button>
              ) : lastPinnedMessage.id === message.id ? (
                <button
                  className="flex w-full items-center space-x-2 text-left"
                  onClick={handlePinMessage}
                >
                  <PinOff size={15} />
                  <span>{t("chat.options.unpin_message")}</span>
                </button>
              ) : (
                <button
                  className="flex w-full items-center space-x-2 text-left"
                  onClick={handlePinMessageWithModal(lastPinnedMessage.id)}
                >
                  <PinIcon size={15} />
                  <span>{t("chat.options.pin_message")}</span>
                </button>
              )}
            </li>
          )}
          <li className="rounded-sm px-2 py-1 hover:bg-accent/50">
            <button
              className="flex w-full items-center space-x-2 text-left"
              onClick={handleEdit}
            >
              <EditIcon size={15} />
              <span>{t("chat.options.edit_message")}</span>
            </button>
          </li>
          <li className="rounded-sm px-2 py-1 hover:bg-accent/50">
            <button
              className="flex w-full items-center space-x-2 text-left"
              onClick={onDelete}
            >
              <Trash2Icon size={16} />
              <span>{t("chat.options.delete_message")}</span>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default MoreOptions;
