import { HoverCardPortal } from "@radix-ui/react-hover-card";
import { ReplyIcon } from "lucide-react";
import React from "react";
import {
  useChannelActionContext,
  useChannelStateContext,
  useMessageContext,
} from "stream-chat-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import type { StreamChatGenerics } from "../../types";
import InstantReactions from "./instant-reactions";
import MoreOptions from "./more-options";
import MoreReactions from "./more-reactions";

const MessageContentWithOptions = (props: {
  children: React.ReactNode;
  onDelete: () => Promise<void>;
}) => {
  const { children, onDelete } = props;
  const { message, isMyMessage } = useMessageContext<StreamChatGenerics>();
  const { quotedMessage } = useChannelStateContext<StreamChatGenerics>();
  const { setQuotedMessage } = useChannelActionContext<StreamChatGenerics>();
  const myMessage = isMyMessage();

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent
          align={myMessage ? "end" : "start"}
          side="top"
          className="!z-40 flex !w-auto items-center !p-1"
        >
          <InstantReactions />
          <div className="flex">
            <MoreReactions />
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-center transition-transform hover:bg-accent/50 active:scale-90"
              onClick={() =>
                setQuotedMessage(!!quotedMessage ? undefined : message)
              }
            >
              <ReplyIcon size={18} />
            </button>
            {myMessage && <MoreOptions onDelete={onDelete} />}
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

export default MessageContentWithOptions;
