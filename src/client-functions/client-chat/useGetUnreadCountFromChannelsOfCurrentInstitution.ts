import { useQueryClient } from "@tanstack/react-query";
import type { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { filterUndefined } from "@/src/utils/utils";
import { getLayerIdsOfUser } from "../client-user";

/**
 * By default getstream returns global unread count in `client.user.unread_channels`
 * (accross all of users institution), thus need to do another fetch to `client.getUnreadCount`
 * to get all unreadCounts with channel information, we compare result with the user's courses
 * of currentInsti to only show notifications with respect to current institution
 * @link https://getstream.io/chat/docs/javascript/unread/?language=javascript
 */
export function useGetUnreadCountFromChannelsOfCurrentInstitution(
  client: StreamChat<StreamChatGenerics>,
) {
  const qc = useQueryClient();

  const getUnreadCount = async () => {
    let unreadChannelCount = 0;
    if (!client.user) return unreadChannelCount;

    const globalUnreadChannels = client.user.unread_channels as number;

    if (!!globalUnreadChannels) {
      const { channels } = await client.getUnreadCount();

      // course channelIds start with course:cuid.. other IDs appear like messaging:cuid
      const unreadCourseChannels = channels
        .filter((ch) => ch.channel_id.startsWith("course:"))
        .map((i) => i.channel_id.split("course:")[1])
        .filter(filterUndefined);

      if (unreadCourseChannels.length) {
        const courseLayerIds = await qc.ensureQueryData({
          queryKey: ["layerIdsOfUser"],
          queryFn: () => getLayerIdsOfUser(true),
          staleTime: 60 * 1000 * 5,
        });

        const courseChannelsFromCurrentInstitution =
          unreadCourseChannels.filter((ch) => courseLayerIds.includes(ch));

        unreadChannelCount = courseChannelsFromCurrentInstitution.length;
      }

      const otherUnreadChannelCount = channels.reduce(
        (p, c) => p + Number(!c.channel_id.startsWith("course:")),
        0,
      );

      unreadChannelCount = otherUnreadChannelCount + unreadChannelCount;
    }

    return unreadChannelCount;
  };

  return { getUnreadCount };
}
