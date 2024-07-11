import { type Dispatch, useReducer } from "react";
import type { Channel, StreamChat } from "stream-chat";
import type {
  ConfigurablePermissions,
  PermissionSystemMessageType,
  StreamChatGenerics,
} from "@/src/components/reusable/page-layout/navigator/chat/types";
import api from "@/src/pages/api/api";
import type { ToggleChannelPermissionBody } from "@/src/pages/api/chat/update-channel-permission";
import { log } from "@/src/utils/logger/logger";

type PermissionState = Record<ConfigurablePermissions, boolean>;
type ReducerAction = { type: ConfigurablePermissions; value: boolean };

export function permissionsReducer<T extends PermissionState>(
  state: T,
  action: ReducerAction,
): T {
  switch (action.type) {
    case "isReadOnlyMode": {
      return {
        ...state,
        isReadOnlyMode: action.value,
      };
    }
    case "isFileAttachmentsDisabled": {
      return {
        ...state,
        isFileAttachmentsDisabled: action.value,
      };
    }
    default:
      return state;
  }
}

export const useChatPermissionsReducer = (initialState: PermissionState) => {
  const [state, dispatch] = useReducer(permissionsReducer, initialState);
  return [state, dispatch] as const;
};

export async function updatePermissions(
  dispatcher: Dispatch<ReducerAction>,
  channel: Channel<StreamChatGenerics>,
  permission: ConfigurablePermissions,
  value: boolean,
) {
  if (!channel.id || !channel.type) return;

  dispatcher({ type: permission, value });
  await _updateChannelPermission(
    {
      id: channel.id,
      type: channel.type,
      permission,
      value,
    },
    () => dispatcher({ type: permission, value: !value }),
  );
}

export function generateSystemPermissionMessage(
  text: PermissionSystemMessageType,
): string {
  switch (text) {
    case "isReadOnlyMode:false": {
      return "chat.system_message.permissions.read_only.false";
    }
    case "isReadOnlyMode:true": {
      return "chat.system_message.permissions.read_only.true";
    }
    case "isFileAttachmentsDisabled:true": {
      return "chat.system_message.permissions.file_attachments_disabled.true";
    }
    case "isFileAttachmentsDisabled:false": {
      return "chat.system_message.permissions.file_attachments_disabled.false";
    }
    default:
      return text;
  }
}

export async function fetchAndUpdateChannelPermissions(
  client: OrNull<StreamChat<StreamChatGenerics>>,
  layerId: string,
  dispatch: React.Dispatch<ReducerAction>,
) {
  if (!client) return;
  try {
    const result = await client.queryChannels({
      cid: `course:${layerId}`,
    });

    const _channel = result?.[0];

    dispatch({
      type: "isReadOnlyMode",
      value: !!_channel?.data?.isReadOnlyMode,
    });

    dispatch({
      type: "isFileAttachmentsDisabled",
      value: !!_channel?.data?.isFileAttachmentsDisabled,
    });

    return _channel;
  } catch (e) {
    log.error(e);
  }
}

export async function updateCourseManagementChatPermissions(
  channel: OrNull<Channel<StreamChatGenerics>> | undefined,
  updatedState: Record<ConfigurablePermissions, boolean>,
  dispatch: React.Dispatch<ReducerAction>,
  setIsSubmitting: (bool: boolean) => void,
  setRefresh: (value: any) => void,
) {
  if (!channel) return;
  setIsSubmitting(true);

  if (updatedState.isReadOnlyMode !== channel.data?.isReadOnlyMode) {
    await updatePermissions(
      dispatch,
      channel,
      "isReadOnlyMode",
      updatedState.isReadOnlyMode,
    );
  }

  if (
    updatedState.isFileAttachmentsDisabled !==
    channel.data?.isFileAttachmentsDisabled
  ) {
    await updatePermissions(
      dispatch,
      channel,
      "isFileAttachmentsDisabled",
      updatedState.isFileAttachmentsDisabled,
    );
  }
  setIsSubmitting(false);
  setRefresh(Date.now());
}

async function _updateChannelPermission(
  args: ToggleChannelPermissionBody,
  /** cb to revert on error */
  onError: () => void,
) {
  const data = await fetch(api.updateChannelPermission, {
    method: "PATCH",
    body: JSON.stringify(args),
  });

  if (!data.ok) {
    log.response(data);
    return onError();
  }
}
