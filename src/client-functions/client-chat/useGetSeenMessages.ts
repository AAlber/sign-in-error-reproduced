import { useCallback } from "react";
import type { UserResponse } from "stream-chat";
import { useChannelStateContext } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";

const useGetSeenMessages = () => {
  const { read, channel } = useChannelStateContext<StreamChatGenerics>();
  const { user: user } = useUser();

  const getSeenMessages = useCallback(() => {
    if (!read) return;

    const userIds = Object.keys(read).filter((id) => user.id !== id);
    const seenMessagesByUsers = userIds.reduce(
      (p, c) => {
        const lastMsgId = read[c]?.last_read_message_id;
        const usr = read[c]?.user;

        if (!lastMsgId || !usr) return p;
        if (lastMsgId in p) {
          p[lastMsgId]?.push(usr);
          return p;
        } else {
          return { ...p, [lastMsgId]: [usr] };
        }
      },
      {} as Record<string, UserResponse<StreamChatGenerics>[]>,
    );

    if (!Object.keys(seenMessagesByUsers).length) return;
    return seenMessagesByUsers;
  }, [channel, read]);

  return { getSeenMessages };
};

export default useGetSeenMessages;
