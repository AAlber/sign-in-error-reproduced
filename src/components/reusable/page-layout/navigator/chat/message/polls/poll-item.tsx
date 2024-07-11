import { useMessageContext } from "stream-chat-react";
import classNames from "@/src/client-functions/client-utils";
import type { StreamChatGenerics } from "../../types";
import { Dot } from "./poll-item-dot";

type Props = {
  label: string;
  isVoted: boolean;
  count: number;
};

export default function PollItem({ label, isVoted, count }: Props) {
  const ctx = useMessageContext<StreamChatGenerics>();
  const isMyMessage = ctx.isMyMessage();

  return (
    <div className="relative z-[2] flex size-full cursor-pointer items-center gap-2 px-2 text-sm">
      <Dot isMyMessage={isMyMessage} isVoted={isVoted} />
      <div
        className={classNames(
          "flex flex-1 items-center justify-between",
          isVoted
            ? "text-white dark:text-contrast"
            : "text-black dark:text-muted",
        )}
      >
        <p>{label}</p>
        {!!count && (
          <p className="text-xs text-contrast dark:text-black">{count}</p>
        )}
      </div>
    </div>
  );
}
