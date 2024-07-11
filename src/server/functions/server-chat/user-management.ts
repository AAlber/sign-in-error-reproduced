import { log } from "@/src/utils/logger/logger";
import type { ChannelType } from "./index";
import { getChannelsById, streamChat } from "./index";

export async function upsertUsers(
  userIds: SimpleUser[],
  institutionId: string,
) {
  log.info("Creating getStream users", { userIds });
  const { users } = await streamChat.upsertUsers(
    userIds.map((user) => ({
      ...user,
      image: user.image || undefined,
      teams: [institutionId],
    })),
  );

  return users;
}

export async function getUser(userId: string, institutionId?: string) {
  const teams = institutionId ? { teams: { $contains: institutionId } } : {};

  const { users } = await streamChat.queryUsers(
    { id: userId, ...teams },
    {},
    { limit: 1 },
  );

  return users[0];
}

export async function getUserChannels(
  userId: string,
  institutionId: string,
  isGroupChat = false,
) {
  const userChannels = await streamChat.queryChannels({
    members: { $in: [userId] },
    team: institutionId,
    ...(isGroupChat
      ? { isGroupChat: { $eq: true } }
      : { $or: [{ isGroupChat: undefined }, { isGroupChat: { $eq: false } }] }),
  });

  return userChannels;
}

export async function removeUsersFromChannel(
  userIds: string | string[],
  channelId: string,
  channelType = "messaging",
) {
  const users = Array.isArray(userIds) ? userIds : [userIds];
  const channel = streamChat.channel(channelType, channelId);
  return channel.removeMembers(users);
}

/**
 * Removes the user from all groups of the institution, including group chats
 * but does not remove the user from the institution itself
 */
async function removeUserFromAllgroupsOfInstitution(
  userId: string,
  institutionId: string,
) {
  const channels = await getUserChannels(userId, institutionId, true);
  const jobs = channels.map((ch) => ch.removeMembers([userId]));
  await Promise.all(jobs);
}

export async function removeUserFromInstitution(
  userId: string,
  institutionId: string,
) {
  const [user] = await Promise.all([
    getUser(userId, institutionId),
    removeUserFromAllgroupsOfInstitution(userId, institutionId),
  ]);

  const institutions = user?.teams;

  if (institutions) {
    const team = institutions.filter(
      (institution) => institution !== institutionId,
    );

    const result = await streamChat.upsertUser({ id: userId, team });
    const institutionChatChannel = streamChat.channel("team", institutionId);
    await institutionChatChannel.removeMembers([userId]);
    return result;
  }
}

export async function removeManyUsersFromInstitution(
  userIds: string[],
  institutionId: string,
) {
  const promises = userIds.map((user) =>
    removeUserFromInstitution(user, institutionId),
  );

  return Promise.all(promises);
}

/**
 * Adds user(s) as a member to chat channel(s) / creates membership with chatChannel
 * 1. Query existing chatChannels
 * 2. Foreach existing chatChannel create a membership for each `userId(s)`
 *
 * Where its used:
 * - `create-role` api - make sure we add user as member to a courseChat
 * - `cerate-layer` api - add userIds of parentLayers into courseChat
 * - `createStackedRole`
 */

export async function createUserMembershipToChannel(
  channelIds: string | string[],
  userId: string | string[],
  channelType = "course",
) {
  const users = Array.isArray(userId) ? userId : [userId];
  const cids = Array.isArray(channelIds) ? channelIds : [channelIds];

  // query existing chatChannels
  const existingChannels = await streamChat.queryChannels({
    cid: { $in: cids.map((id) => `${channelType}:${id}`) },
  });

  return !!existingChannels.length
    ? await Promise.allSettled(
        existingChannels.map((channel) => channel.addMembers(users)),
      )
    : [];
}

/**
 * Removes user(s) membership from provided channelIds
 * inverse of {@link createUserMembershipToChannel}
 */
export async function removeUserMembershipFromChannel(
  channelIds: string | string[],
  userId: string | string[],
  channelType = "course",
) {
  const users = Array.isArray(userId) ? userId : [userId];
  const cids = Array.isArray(channelIds) ? channelIds : [channelIds];

  // query existing chatChannels
  const existingChannels = await streamChat.queryChannels({
    cid: { $in: cids.map((id) => `${channelType}:${id}`) },
  });

  return !!existingChannels.length
    ? await Promise.allSettled(
        existingChannels.map((channel) => channel.removeMembers(users)),
      )
    : [];
}

/**
 * Gets a user's role in the channel
 * used in: `update-channel-permission` api - check if user has permissions to update channel permission
 */
export async function getChannelRole(
  userId: string,
  channelId: string,
  channelType: ChannelType,
) {
  const channels = await getChannelsById(channelId, channelType);
  const channel = channels[0];

  const result = await channel?.queryMembers({ id: { $in: [userId] } });
  return result?.members[0]?.role;
}
