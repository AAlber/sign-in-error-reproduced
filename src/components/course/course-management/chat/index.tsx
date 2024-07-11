import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchAndUpdateChannelPermissions,
  updateCourseManagementChatPermissions,
  useChatPermissionsReducer,
} from "@/src/client-functions/client-chat/permissions";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import { useStreamChatContext } from "@/src/components/getstream";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import SwitchGroup from "@/src/components/reusable/settings-switches/switch-group";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";

type Props = {
  layerId: string;
};

function CourseManagementChat({ layerId }: Props) {
  const chatCtx = useStreamChatContext();
  const { t } = useTranslation("page");
  const [refresh, setRefresh] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, dispatch] = useChatPermissionsReducer({
    isReadOnlyMode: false,
    isFileAttachmentsDisabled: false,
  });

  const { data: channel, loading } = useAsyncData(
    () => fetchAndUpdateChannelPermissions(chatCtx.client, layerId, dispatch),
    refresh,
  );

  return (
    <SettingsSection
      title="course_management.chat.title"
      subtitle="course_management.chat.subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={loading || isSubmitting}
      footerButtonAction={() => {
        return updateCourseManagementChatPermissions(
          channel,
          state,
          dispatch,
          setIsSubmitting,
          setRefresh,
        );
      }}
    >
      <SwitchGroup className="divide-y-0 border-none">
        <SwitchItem
          checked={state.isReadOnlyMode}
          label={t("chat.group_settings.permissions.read_only_mode")}
          onChange={(value) => dispatch({ type: "isReadOnlyMode", value })}
          disabled={loading}
        />
        <SwitchItem
          checked={state.isFileAttachmentsDisabled}
          label={t("chat.group_settings.permissions.disable_sending_files")}
          disabled={loading}
          onChange={(value) =>
            dispatch({ type: "isFileAttachmentsDisabled", value })
          }
        />
      </SwitchGroup>
    </SettingsSection>
  );
}

export default CourseManagementChat;
