import clsx from "clsx";
import pick from "lodash/pick";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { StreamMessage } from "stream-chat-react";
import useGetSeenMessages from "@/src/client-functions/client-chat/useGetSeenMessages";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import UserDefaultImage from "@/src/components/user-default-image";
import type { StreamChatGenerics } from "../types";

type Props = {
  isMyMessage: boolean;
  hasReactions: boolean;
  message: StreamMessage<StreamChatGenerics>;
};

const SLICE_AT = 4;

const SeenBy: React.FC<Props> = ({ hasReactions, isMyMessage, message }) => {
  const { getSeenMessages } = useGetSeenMessages();
  const seenMessages = getSeenMessages();
  const { t } = useTranslation("page");
  const seenByUsers = useMemo(() => {
    if (seenMessages && message.id in seenMessages) {
      const pickedSeenMessage = pick(seenMessages, message.id);
      return pickedSeenMessage[message.id]?.filter((user) => {
        // remove the sender from seeing his own message
        const uid = user.id;
        return message.user?.id !== uid;
      });
    }
  }, [seenMessages]);

  const names = seenByUsers?.reduce((p, c, idx) => {
    const name = c.name ?? c.email ?? "Unknown user";
    return idx === 0
      ? name
      : idx === seenByUsers.length - 1
      ? `${p} and ${name}`
      : `${p}, ${name}`;
  }, "");

  if (!seenByUsers) return null;
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={clsx(
            "hidden items-center -space-x-1.5 lg:flex",
            isMyMessage ? "justify-end" : "ml-12",
            hasReactions ? "mb-2" : "my-2",
          )}
        >
          {seenByUsers.slice(0, SLICE_AT).map((user) => (
            <div key={user.id} className="h-4 w-4">
              <UserDefaultImage
                user={{ id: user.id, image: user.image }}
                dimensions="h-4 w-4"
              />
            </div>
          ))}
          {seenByUsers.length - SLICE_AT + 1 > 0 && (
            <div
              className={clsx(
                "h-4 w-auto rounded-full border border-border bg-background px-1 text-center text-[11px] text-muted-contrast",
              )}
            >{`+${seenByUsers.length - SLICE_AT + 1}`}</div>
          )}
        </div>
      </HoverCardTrigger>
      {names && (
        <HoverCardContent
          side="top"
          align={isMyMessage ? "end" : "start"}
          className="!max-w-sm text-xs text-contrast"
        >
          <p className="mb-1 text-muted-contrast">{t("seen.by")}</p>
          <p>{names}</p>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default SeenBy;
