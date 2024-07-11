import { Settings } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  updatePermissions,
  useChatPermissionsReducer,
} from "@/src/client-functions/client-chat/permissions";
import SwitchGroup from "@/src/components/reusable/settings-switches/switch-group";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import useUser from "@/src/zustand/user";
import { useChannelHeaderContext } from "../channel-header";

export default function Permissions() {
  const { user: data } = useUser();
  const { channel } = useChannelHeaderContext();
  const { t } = useTranslation("page");

  const membership = channel.state.members;
  const channelMembership = membership[data.id];
  const canUpdatePermissions = channelMembership?.role !== "member";
  const isReadOnlyMode = !!channel.data?.isReadOnlyMode;
  const isFileAttachmentsDisabled = !!channel.data?.isFileAttachmentsDisabled;

  const [state, dispatch] = useChatPermissionsReducer({
    isReadOnlyMode,
    isFileAttachmentsDisabled,
  });

  useEffect(() => {
    dispatch({ type: "isReadOnlyMode", value: isReadOnlyMode });
    dispatch({
      type: "isFileAttachmentsDisabled",
      value: isFileAttachmentsDisabled,
    });
  }, [channel]);

  if (!canUpdatePermissions) return null;
  return (
    <Popover>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button variant={"ghost"}>
          <Settings className="h-4 w-4 text-contrast hover:text-accent-contrast" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 p-0 text-sm">
        <SwitchGroup className="divide-y-0 border-none">
          <WithToolTip
            delay={1000}
            className="border-b border-border"
            text={t("chat.group_settings.permissions.help.read_only")}
          >
            <SwitchItem
              checked={state.isReadOnlyMode}
              label={t("chat.group_settings.permissions.read_only_mode")}
              onChange={(value) =>
                updatePermissions(dispatch, channel, "isReadOnlyMode", value)
              }
            />
          </WithToolTip>
          <SwitchItem
            checked={state.isFileAttachmentsDisabled}
            label={t("chat.group_settings.permissions.disable_sending_files")}
            onChange={(value) =>
              updatePermissions(
                dispatch,
                channel,
                "isFileAttachmentsDisabled",
                value,
              )
            }
          />
        </SwitchGroup>
      </PopoverContent>
    </Popover>
  );
}
