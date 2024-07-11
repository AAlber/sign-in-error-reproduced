import React from "react";
import { useTranslation } from "react-i18next";
import type { EventComponentProps } from "stream-chat-react";
import { generateSystemPermissionMessage } from "@/src/client-functions/client-chat/permissions";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type {
  PermissionSystemMessageType,
  StreamChatGenerics,
} from "@/src/components/reusable/page-layout/navigator/chat/types";
import useUser from "@/src/zustand/user";

const MessageSystem: React.FC<EventComponentProps<StreamChatGenerics>> = (
  props,
) => {
  const { message } = props;
  const { user: user } = useUser();

  const { t } = useTranslation("page");

  const createSystemMessage = () => {
    switch (message.systemMessageType) {
      case "channel.update.name":
        return replaceVariablesInString(
          t("chat.system_message.channel.update.name"),
          [message.user?.name ?? ""],
        );
      case "channel.update.image":
        return replaceVariablesInString(
          t("chat.system_message.channel.update.image"),
          [message.user?.name ?? "", message.text ?? ""],
        );
      case "channel.member.new":
        return replaceVariablesInString(
          t("chat.system_message.channel.member.new"),
          [message.text ?? ""],
        );
      case "channel.member.remove":
        if (message.text === user.name)
          return t("chat.system_message.channel.member.remove.me");

        return replaceVariablesInString(
          t("chat.system_message.channel.member.remove"),
          [message.text ?? ""],
        );
      case "channel.system.permissions":
        if (message.text) {
          return t(
            generateSystemPermissionMessage(
              message.text as PermissionSystemMessageType,
            ),
          );
        }
      default:
        return null;
    }
  };

  if (message.type !== "system" || !message.systemMessageType) return null;
  return (
    <div className="my-8 text-sm text-muted-contrast">
      <div className="text-center text-xs">
        <span>{createSystemMessage()}</span>
      </div>
    </div>
  );
};

export default MessageSystem;
