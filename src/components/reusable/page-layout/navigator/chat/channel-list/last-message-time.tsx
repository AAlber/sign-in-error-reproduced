import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import type { StreamMessage } from "stream-chat-react";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../types";

// Inside your component where you render the last message
const LastMessageTime = ({
  lastMessage,
  isUnread,
}: {
  lastMessage: StreamMessage<StreamChatGenerics> | undefined;
  isUnread: boolean;
}) => {
  const { user } = useUser();
  const locale = user.language === "de" ? de : enUS;
  const now = new Date();
  const lastUpdateTime = lastMessage?.updated_at
    ? new Date(lastMessage.updated_at)
    : now;
  const secondsDiff = differenceInSeconds(now, lastUpdateTime);
  const { t } = useTranslation("page");
  const timeAgo =
    secondsDiff < 60
      ? t("chat.messages.now")
      : formatDistanceToNow(lastUpdateTime, { addSuffix: true, locale });

  return <span className={"text-[10px] text-muted-contrast"}>{timeAgo}</span>;
};

export default LastMessageTime;
