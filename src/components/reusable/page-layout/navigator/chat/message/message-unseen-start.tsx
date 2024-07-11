import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChannelStateContext } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";

interface MessageUnseenStartProps {
  messageId: string;
  msToDisappear?: number;
}
const MessageUnseenStart: React.FC<MessageUnseenStartProps> = (props) => {
  const { unseenMessageStart } = useChat();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const msToDisappear = props.msToDisappear ?? 10000;

  const [disappear, setDisappear] = useState(
    unseenMessageStart[channel.id ?? ""] !== props.messageId,
  );

  const { t } = useTranslation("page");

  useEffect(() => {
    if (disappear) return;
    const timeout = setTimeout(() => {
      setDisappear(true);
    }, msToDisappear);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={clsx(
        disappear
          ? "max-h-0 opacity-0"
          : "mx-4 mb-1 mt-2 max-h-[9999px] opacity-100",
        "relative flex items-center justify-center transition-all",
      )}
    >
      <Separator className="grow" />

      <span className="whitespace-nowrap pr-8 text-center text-xs text-muted-contrast lg:ml-8">
        {t("unread.messages")}
      </span>

      <Separator className="grow" />
    </div>
  );
};

export default MessageUnseenStart;
