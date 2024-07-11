import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Event } from "stream-chat";
import { getChannel, useChatContext } from "stream-chat-react";
import useCourse from "@/src/components/course/zustand";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import useUser from "@/src/zustand/user";
import { getLayerIdsOfUser } from "../client-user";
import { truncate } from "../client-utils";
import { useIsWindowVisible } from "../client-utils/hooks";
import type { NotifyArgs } from ".";
import { getTextFromHtml, notifyNewMessage } from "./index";
import { useGetUnreadCountFromChannelsOfCurrentInstitution } from "./useGetUnreadCountFromChannelsOfCurrentInstitution";

/**
 * Util hook that renders a notification UI
 * if a getstream event has happened, such as a new message
 */
const useListenNewMessages = (audio: HTMLAudioElement) => {
  const { openChatWithUser } = useOpenChatWithUser();
  const { client, channel } = useChatContext<StreamChatGenerics>();
  const { getUnreadCount } =
    useGetUnreadCountFromChannelsOfCurrentInstitution(client);

  const setUnreadChannels = useChat((state) => state.setUnreadChannels);

  const auth = useAuth();
  const qc = useQueryClient();
  const user = useUser((state) => state.user);
  const currentChannel = channel?.id;

  const {
    notificationsPreference: { isSoundNotificationsEnabled },
  } = useUser();
  const { t: translate } = useTranslation("page");
  const { isWindowVisible } = useIsWindowVisible();

  const notify = useCallback(
    (
      args: Omit<NotifyArgs, "translate" | "onClick" | "isWindowVisible"> & {
        channelId: string;
        channelType: "messaging" | "course";
        channelIcon?: string;
      },
    ) => {
      const { channelId, channelType, ...rest } = args;
      notifyNewMessage({
        ...rest,
        isWindowVisible,
        translate,
        onClick: () => {
          openChatWithUser(channelId, undefined, {
            isChannel: true,
            type: channelType,
          });
        },
      });
    },
    [isWindowVisible],
  );

  useEffect(() => {
    function isChannelMuted(e: Event<StreamChatGenerics>) {
      const isMuted = e.channel?.muted;
      if (typeof isMuted === "boolean") return isMuted;
      const { mutedChannels } = useChat.getState();
      return mutedChannels.includes(e.channel_id ?? "");
    }

    const { unsubscribe } = client.on(async (e) => {
      if (!auth.isSignedIn || !auth.userId) return;

      const isMuted = isChannelMuted(e);
      const isInCourseChat =
        useCourse.getState().course.layer_id === e.channel_id;

      const isChatOpen = pageHandler.get.currentPage().titleKey === "CHAT";
      const isChatVisible = isChatOpen || isInCourseChat;
      const channelId = e.channel?.id ?? e.channel_id ?? "";
      const channelType = (e.channel?.type ?? e.channel_type ?? "messaging") as
        | "messaging"
        | "course"
        | "system";

      const courseLayerIds = await qc.ensureQueryData({
        queryKey: ["layerIdsOfUser"],
        queryFn: () => getLayerIdsOfUser(true),
        staleTime: 60 * 1000 * 5,
      });

      const isCounted =
        (channelType !== "system" && channelType !== "course") ||
        (channelType === "course" && courseLayerIds.includes(channelId));

      const shouldNotify =
        user.institution?.institutionSettings.communication_messaging &&
        (!isChatVisible || !isWindowVisible) &&
        e.message?.user?.id !== user.id &&
        isCounted &&
        !isMuted;

      switch (e.type) {
        // if this case pass then we did not yet open the chat UI
        case "notification.message_new": {
          if (isCounted) {
            const count = await getUnreadCount();
            setUnreadChannels(count);
          }

          if (shouldNotify) {
            const description = truncate(
              getTextFromHtml(e.message?.html ?? ""),
              100,
            );

            const isGroupChat =
              e.channel?.isGroupChat || e.channel_type === "course";

            notify({
              sender: e.message?.user?.name ?? t("someone"),
              title: `${isGroupChat ? e.channel?.name : e.message?.user?.name}`,
              description,
              channelId,
              senderId: e.message?.user?.id,
              senderImage: e.message?.user?.image,
              channelType,
            });
            if (isSoundNotificationsEnabled) audio.play();
          }

          break;
        }
        case "message.new": {
          if (
            (!isChatOpen || e.channel_id !== currentChannel) &&
            !isMuted &&
            isCounted
          ) {
            const count = await getUnreadCount();
            setUnreadChannels(count);
          }

          if (shouldNotify) {
            const description = truncate(
              getTextFromHtml(e.message?.html ?? ""),
              100,
            );

            const channel = await getChannel({
              client,
              type: e.channel_type ?? "messaging",
              id: e.channel_id,
            });

            const isGroupChat =
              channel.data?.isGroupChat || channel.data?.type === "course";

            notify({
              sender: e.message?.user?.name ?? t("someone"),
              title: `${
                isGroupChat ? channel.data?.name : e.message?.user?.name
              }`,
              description,
              senderId: e.message?.user?.id,
              senderImage: e.message?.user?.image,
              channelId,
              channelType,
            });

            if (isSoundNotificationsEnabled) audio.play();
          }
          break;
        }
        case "message.read": {
          const count = await getUnreadCount();
          setUnreadChannels(count);
          break;
        }
        default: {
        }
      }
    });
    return () => {
      unsubscribe?.();
    };
  }, [
    auth.isSignedIn,
    auth.userId,
    currentChannel,
    isSoundNotificationsEnabled,
    isWindowVisible,
  ]);
};

export default useListenNewMessages;
