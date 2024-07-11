import { useCallback } from "react";
import type { Channel } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";

/**
 * Util hook to get all channels a user is a member of
 * max limit is per request is 30
 * https://getstream.io/chat/docs/javascript/query_channels/?language=javascript
 */
const useGetAllChannelsOfUser = (channelType = "messaging", limit = 30) => {
  const { client } = useChatContext<StreamChatGenerics>();
  const { user: user } = useUser();

  const getAllChannels = useCallback(async () => {
    let channels: Channel<StreamChatGenerics>[] = [];
    let offset = 0;

    while (true) {
      const ch = await client.queryChannels(
        {
          joined: {
            $eq: true,
          },
          members: {
            $in: [user.id],
          },
          type: {
            $eq: channelType,
          },
          team: {
            $eq: user.currentInstitutionId,
          },
        },
        {},
        { state: true, limit, offset, watch: true },
      );

      if (ch.length < limit || ch.at(-1)?.id === channels.at(-1)?.id) {
        channels = [...channels, ...ch];
        break;
      }
      channels = [...channels, ...ch];
      offset = offset + limit;
    }

    return channels;
  }, [client, channelType, limit]);

  return { getAllChannels };
};

export default useGetAllChannelsOfUser;
