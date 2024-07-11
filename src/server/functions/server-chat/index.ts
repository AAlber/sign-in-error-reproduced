import type { Course, Institution, Layer } from "@prisma/client";
import type { Channel } from "stream-chat";
import { StreamChat } from "stream-chat";
import type {
  ConfigurablePermissions,
  PermissionSystemMessageType,
  StreamChatGenerics,
} from "@/src/components/reusable/page-layout/navigator/chat/types";
import { env } from "@/src/env/server.mjs";
import { log } from "@/src/utils/logger/logger";
import { retry } from "@/src/utils/utils";
import { sentry } from "../../singletons/sentry";
import {
  getInstitutionsOfUser,
  getMembersAndEducatorsFromLayer,
} from "../server-administration";

export const streamChat = new StreamChat<StreamChatGenerics>(
  env.STREAM_API_KEY,
  env.STREAM_API_SECRET,
  { timeout: 60000 },
);

export type ChannelType =
  | "messaging"
  | "course"
  | "teams"
  | (string & {
      //
    });

export async function createCourseLobby(args: {
  /**
   * The Channel ID
   */
  layerId: string;
  /**
   * The Channel name
   */
  courseName: string;
  /**
   * The `owner` (course creator) of the channel
   */
  userId: string;
  /**
   * The `team` this course should belong to
   */
  institutionId: string;
  /**
   * Optional meta
   */
  image?: string;
  institutionName?: string;
}) {
  const { layerId, courseName, userId, institutionId, institutionName, image } =
    args;
  const _channel = streamChat.channel("course", layerId, {
    created_by_id: userId,
    team: institutionId,
  });

  await _channel.create();
  await _channel.update({
    name: courseName,
    team: institutionId,
    ...(image ? { image } : {}),
    ...(institutionName ? { institution_name: institutionName } : {}),
  });

  const { channel } = await _channel.addModerators([userId]);
  return channel;
}

export async function getChannelsById(
  channelId: string,
  channelType: ChannelType = "messaging",
) {
  const channels = await streamChat.queryChannels({
    cid: `${channelType}:${channelId}`,
  });

  return channels;
}

export async function renameCourseChatChannel(
  courseId: string,
  newName: string,
) {
  try {
    const channel = streamChat.channel("course", courseId);
    const res = await channel.updatePartial({
      set: {
        name: newName,
      },
    });

    return res;
  } catch (e) {
    console.log(e);
    return Promise.resolve();
  }
}

export async function deleteChatChannel(
  channelId: string,
  channelType: ChannelType = "messaging",
) {
  const _channel = streamChat.channel(channelType, channelId);
  const res = await _channel.delete({ hard_delete: true });

  return res;
}

export async function findAndDeleteChannel(
  channelId: string,
  channelType: ChannelType = "messaging",
) {
  let isSuccess = false;
  const channels = await getChannelsById(channelId, channelType);
  const ids = channels.map((i) => {
    return i.id;
  });

  if (ids.includes(channelId)) {
    await deleteChatChannel(channelId, channelType);
    isSuccess = true;
  }

  return isSuccess;
}

export async function createInstitutionChatChannel(args: {
  /**
   * The channel and team ID
   */
  institutionId: string;
  /**
   * The name of the channel
   */
  institutionName: string;
  /**
   * The owner or (creator) of the chat channel
   */
  adminId: string;
}) {
  sentry.addBreadcrumb({
    message: "Creating the institution chat channel",
    data: args,
  });

  const { institutionId, institutionName, adminId } = args;
  const userInstitutions = await getInstitutionsOfUser(adminId);
  const teams = userInstitutions.map((i) => i.id);

  await streamChat.upsertUser({
    id: adminId,
    teams,
  });

  const channel = await streamChat
    .channel("team", institutionId, {
      team: institutionId,
      created_by_id: adminId,
      // members: [adminId],
      name: institutionName,
    })
    .create();

  // await streamChat.channel("team", institutionId, {}).addModerators([adminId]);
  return channel;
}

/** Deletes course chat, AKA known as lobbies */
export async function deleteLobbies(ids: string[]) {
  const lobbies = ids.map((i: string) => `course:${i}`);
  const channelsToDelete = await streamChat.queryChannels({
    cid: {
      $in: lobbies,
    },
  });

  if (!channelsToDelete.length) return Promise.resolve();

  // TODO: also delete course notification feeds
  const channelsToDeletePromises = channelsToDelete.map((ch) => {
    return ch.delete({ hard_delete: true });
  });

  const result = await Promise.all(channelsToDeletePromises);

  const cids = result
    .map((i) => i.channel.cid)
    .reduce((p, c) => `${p} ${c}`, "");
  console.log(`getstream-chat: Successfully deleted channel cids: ${cids}`);

  return result;
}

export async function syncCourseDataWithGetstream(
  courseData: Course & { layer: Layer },
) {
  const courseChannel = streamChat.channel("course", courseData.layer_id);
  const { channel } = await courseChannel.query({});

  if (courseData?.icon !== channel.image && courseData?.icon) {
    await courseChannel.updatePartial({
      set: {
        image: courseData.icon,
        team: courseData.institution_id,
      },
    });
  }

  if (courseData?.layer_id && courseData?.name !== channel.name) {
    await renameCourseChatChannel(courseData?.layer_id, courseData?.name);
  }

  const members = await getMembersAndEducatorsFromLayer(courseData.layer);
  if (!!members.length) {
    // sync members of the layer with courseChat channel
    const memberIds = members.map((i) => i.id);
    await courseChannel.addMembers(memberIds);
  }
}

export const createInstitutionChat = async (
  institution: Institution,
  userId: string,
) => {
  if (userId) {
    const res = await retry(
      () =>
        createInstitutionChatChannel({
          institutionId: institution.id,
          institutionName: institution.name,
          adminId: userId,
        }),
      {
        retryIntervalMs: 1000,
      },
    );
    console.log(JSON.stringify(res));
  }
};

/**
 * updates the granted permissions of a channel
 * updated permissions will only affect members with `channel_member` role
 * used in: `update-channel-permission` api
 *
 * - Get the list of permissions available for a channel by querying `streamChat.listPermissions()`
 * - `channel.data.config.grants` only shows on server
 * - https://getstream.io/chat/docs/react/user_permissions/#channel-level-permissions
 */
export async function updateChannelPermission(
  permission: ConfigurablePermissions,
  channelId: string,
  channelType: ChannelType,
  value: boolean,
) {
  log.info("Updating Chat Channel Permissions", {
    channelId,
    channelType,
    value,
  });

  const channels = await getChannelsById(channelId, channelType);
  const channel = channels[0];
  if (!channel) throw new Error("Channel not found");

  const updatedGrants = _updateChannelGrants(channel, permission, value);
  const updatedChannel = await channel?.updatePartial({
    set: {
      [permission]: value,
      config_overrides: {
        grants: {
          channel_member: updatedGrants,
          user: updatedGrants,
          guest: updatedGrants,
        },
      },
    },
  });

  // send a system message to inform users of changes
  await channel.sendMessage({
    type: "system",
    text: `${permission}:${value}` as PermissionSystemMessageType,
    user_id: "SYSTEM",
    systemMessageType: "channel.system.permissions",
  });

  log.info("Successfully updated permissions");
  return updatedChannel;
}

function _updateChannelGrants(
  channel: Channel<StreamChatGenerics>,
  permission: ConfigurablePermissions,
  value: boolean,
): string[] {
  // Define the denied permissions for each configurable permission
  const deniedPermissionsMap: Record<ConfigurablePermissions, string[]> = {
    isReadOnlyMode: ["!create-message-any-team", "!create-message"],
    isFileAttachmentsDisabled: [
      "!upload-attachment-any-team",
      "!upload-attachment",
    ],
  };

  // Retrieve the current granted permissions of `channel_member` role
  const grants: string[] =
    channel.data?.config?.["grants"]?.channel_member ?? [];

  // Get the denied permissions for the given permission
  const deniedPermissions = deniedPermissionsMap[permission];

  // Add or remove denied permissions based on the value
  return value
    ? grants.concat(deniedPermissions)
    : grants.filter((p) => !deniedPermissions.includes(p));
}
