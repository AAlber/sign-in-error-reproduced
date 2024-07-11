import { useCallback } from "react";
import type { Channel, ChannelData } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import type {
  AdditionalChannelMeta,
  StreamChatGenerics,
} from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";
import { useGetChatChannelById } from "./index";

export const useSetChannel = () => {
  const { user: user } = useUser();
  const ctx = useChatContext<StreamChatGenerics>("useSetChannel");
  const { getChannelById } = useGetChatChannelById();

  const setActiveChannel = useCallback(
    async (args: SetActiveChannelArgsType) => {
      if (!args.id) return;
      if (args.id.length === 2 && args.id.includes(user.id)) {
        /**
         * just make sure that a string and not an array of ids is passed
         * when creating a 1-1 chat
         */
        throw new Error("Pass a string instead of array for 1-1 conversations");
      }

      const {
        groupId = crypto.randomUUID(),
        id,
        isChannel = false,
        name = Array.isArray(id) && id.length > 1 ? "unnamed_group" : "",
        type = "messaging",
        channelMeta,
      } = args;

      const isGroup = Array.isArray(id);
      let channel: Channel<StreamChatGenerics>;

      if (isChannel) {
        channel = ctx.client.channel(type, id as string);
      } else {
        const members = Array.from(
          new Set(isGroup ? [...id, user.id] : [id, user.id]),
        );

        // Check if channel exists in state
        const isExisting = isGroup
          ? await getChannelById(groupId)
          : ctx.client.getChannelByMembers(type, {
              members,
              team: user.currentInstitutionId,
            });

        if (!isExisting?.id) {
          const opts: ChannelData<StreamChatGenerics> = {
            ...channelMeta,
            members,
            team: user.currentInstitutionId, // from which institution this chat is bound to
            name,
            isGroupChat: isGroup,
          };

          // If a group, create a NON-DISTINCT channel
          const args = isGroup ? [groupId, opts] : [opts];
          channel = ctx.client.channel(
            type,
            ...(args as [string, typeof opts]),
          );
        } else {
          channel = isExisting;
        }
      }

      ctx.setActiveChannel(channel);
      await channel.watch({ state: true, watch: true });

      return channel;
    },
    [],
  );

  return { setActiveChannel };
};

export type SetActiveChannelArgsType = {
  /**
   * TODO: fix id type, suggest to use array if id is user, string if id is channel
   *
   * the channelId or userId[s] to chat with
   * if channelId, set isChannel to true
   * pass single id to create a 1-1 chat
   * pass an array of ids to create a group chat
   */
  id: string | string[] | undefined;
} & Partial<{
  groupId: string;
  name: string;
  isChannel: boolean;
  channelMeta: Partial<AdditionalChannelMeta>;
  type:
    | "messaging"
    | "course"
    | (string & {
        //
      });
}>;
