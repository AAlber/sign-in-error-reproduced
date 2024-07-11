import dayjs from "dayjs";
import * as DOMPurify from "dompurify";
import { CornerUpRight, MoreHorizontal, PinIcon, PinOff } from "lucide-react";
import React from "react";
import {
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { truncate } from "@/src/client-functions/client-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { StreamChatGenerics } from "../types";
import { useChannelHeaderContext } from ".";

const PinnedMessages = () => {
  const { client } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelHeaderContext();
  const { pinnedMessages } = useChannelStateContext<StreamChatGenerics>();
  const { jumpToMessage } = useChannelActionContext<StreamChatGenerics>();
  const latestPinnedMessage = pinnedMessages?.at(-1);
  const canUnpinMessage =
    !!channel.data?.own_capabilities?.includes("pin-message");

  if (!latestPinnedMessage) return null;

  const { user, text, created_at } = latestPinnedMessage;
  const date = dayjs(created_at).format("MM.D.YYYY");
  const sanitizer = DOMPurify.sanitize;
  return (
    <div
      className="flex cursor-pointer justify-between border-b border-border bg-foreground p-4 text-xs text-muted-contrast shadow-md transition-colors hover:text-contrast"
      onClick={() => {
        jumpToMessage(latestPinnedMessage.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <PinIcon size={16} />
        <p>{user?.name}: </p>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitizer(truncate(text ?? "", 60)),
          }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <p>{date}</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem className="space-x-2">
                <CornerUpRight size={16} />
                <span>Jump to Message</span>
              </DropdownMenuItem>
              {canUnpinMessage && (
                <DropdownMenuItem
                  className="space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    client
                      .unpinMessage(latestPinnedMessage.id)
                      .catch(console.log);
                  }}
                >
                  <PinOff size={16} />
                  <span>Unpin Message</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PinnedMessages;
