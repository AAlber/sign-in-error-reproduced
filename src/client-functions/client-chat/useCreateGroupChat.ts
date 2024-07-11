import { useTranslation } from "react-i18next";
import { useChatContext } from "stream-chat-react";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { toast } from "@/src/components/reusable/toaster/toast";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import { useSetChannel } from "./useSetChannel";

export const useCreateGroupChat = (
  isCreatedInInstitutionSettings = true,
  groupId?: string,
  groupName?: string,
) => {
  const { t } = useTranslation("page");
  const { setActiveChannel } = useSetChannel();
  const { client } = useChatContext<StreamChatGenerics>();
  const institutionId = useUser((state) => state.user.currentInstitutionId);

  log.click("getStream client: creating a group chat");

  const createGroupChatWith = async (
    users: { id: string; email: string }[],
  ) => {
    const ids = users.map((u) => u.id);
    const { users: getStreamExistingUsers } = await client.queryUsers({
      id: { $in: ids },
      teams: { $in: [institutionId] },
    });

    const getStreamUserIds = getStreamExistingUsers.map((i) => i.id);
    const nonExistingUsersInGetstream = users.filter(
      (user) => !getStreamUserIds.includes(user.id),
    );

    const nonExistingUserEmails = nonExistingUsersInGetstream.map(
      (i) => i.email,
    );

    if (!!nonExistingUserEmails.length) {
      toast.warning(
        "chat.channel.create.group_chat.warning.inactive_users.toast.title",
        {
          description: t(
            "chat.channel.create.group_chat.warning.inactive_users.toast.description",
            { emails: nonExistingUserEmails.join(", ") },
          ),
          duration: 10000,
        },
      );
    }

    await setActiveChannel({
      channelMeta: { isCreatedInInstitutionSettings },
      groupId,
      id: getStreamExistingUsers.map((i) => i.id),
      name: groupName,
      type: "messaging",
    }).catch(console.log);

    pageHandler.set.page("CHAT");
  };

  return { createGroupChatWith };
};
