import React from "react";
import { useTranslation } from "react-i18next";
import { useSetChannel } from "@/src/client-functions/client-chat/useSetChannel";
import { getUsersOfAllInstitutions } from "@/src/client-functions/client-user";
import UserSearchSelectModal from "@/src/components/reusable/user-search-select-modal";
import { log } from "@/src/utils/logger/logger";

export default function CreateGroupChatModal() {
  const { setActiveChannel } = useSetChannel();
  const { t } = useTranslation("page");

  const handleCreateGroupChatChannel = (users: SimpleUser[]) => {
    const firstUid = users[0]?.id ?? "";
    if (!firstUid) return;

    // for 1-1 conversation, we just extract the uid from the array
    const id = users.length === 1 ? firstUid : users.map((u) => u.id);
    const isGroupChat = Array.isArray(id);

    setActiveChannel({
      id,
      channelMeta: { isGroupChat },
      type: "messaging",
    })
      .then(() => {
        log.info("Group chat created successfully", {
          channelId: id,
          isGroupChat,
        });
      })
      .catch((error) => {
        log.error(error);
        console.log(error);
      });
  };

  return (
    <UserSearchSelectModal
      confirmLabel={t("general.confirm")}
      customFetcher={getUsersOfAllInstitutions}
      onConfirm={handleCreateGroupChatChannel}
      subtitle={t("chat.search.users.modal.subtitle")}
      title={t("chat.search.users.modal.title")}
    />
  );
}
