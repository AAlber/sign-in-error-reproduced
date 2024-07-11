import { type ChannelType, streamChat } from ".";

export async function promoteMemberToModerator(
  userId: string,
  channelId: string,
  channelType: ChannelType = "messaging",
) {
  const channel = streamChat.getChannelById(channelType, channelId, {});
  const result = await channel.addModerators([userId]);
  return result;
}

export async function demoteMemberAsModerator(
  userId: string,
  channelId: string,
  channelType: ChannelType = "messaging",
) {
  const channel = streamChat.getChannelById(channelType, channelId, {});
  const result = await channel.demoteModerators([userId]);
  return result;
}
