/* eslint-disable @typescript-eslint/ban-types */
import type { ExtendableGenerics, LiteralStringForUnion } from "stream-chat";
import type { DefaultStreamChatGenerics } from "stream-chat-react";

export type ChatUserType = Pick<SimpleUser, "image" | "email">;

export type SystemMessageTypes =
  | "channel.update.name"
  | "channel.update.image"
  | "channel.member.new"
  | "channel.member.remove"
  | "channel.system.permissions";

export type PermissionSystemMessageType =
  `${ConfigurablePermissions}:${boolean}`;

type withCode = {
  isCode: true;
  codeValue: string;
  codeLanguage: ProgrammingLanguage["name"];
};

type withoutCode = {
  isCode: never;
};

export type AttachmentType = {};
export type ChannelType = Partial<AdditionalChannelMeta> &
  DefaultStreamChatGenerics["channelType"];
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {
  isEdited: true;
  systemMessageType?: SystemMessageTypes;
} & (withCode | withoutCode) &
  DefaultStreamChatGenerics["messageType"];
export type ReactionType = { emoji_id: string };
export type UserType = Partial<ChatUserType> &
  DefaultStreamChatGenerics["userType"];

export interface StreamChatGenerics extends ExtendableGenerics {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
}

export type AdditionalChannelMeta = {
  // name: string;
  team: string; // the institution id
  institution_name: string; // TODO: add institution name
  isGroupChat: boolean;
  /** channel_members can only read messages, channel owners and moderators can still send messages  */
  isReadOnlyMode?: boolean;
  isFileAttachmentsDisabled?: boolean;
  isCreatedInInstitutionSettings: boolean;
  own_capabilities: ChannelCapabilities;
};

/**
 * These are custom properties which we to attach to a Channel's metadata.
 * we can set a channel's granted permissions based on the boolean equivalent of these properties.
 * on the frontend we can check if these flags so available and we can render a UI accordingly
 *
 * ex.
 * if `isReadOnlyMode` is true, then channel members with a role of "member" can only "read"
 * the Channel. On the UI for "member" we can remove the chat-text-input making it read-only
 */
export type ConfigurablePermissions = Extract<
  keyof AdditionalChannelMeta,
  "isReadOnlyMode" | "isFileAttachmentsDisabled"
>;

/**
 * https://getstream.io/chat/docs/react/channel_capabilities/?q=own_capabilities
 */
type ChannelCapabilities = [
  "ban-channel-members",
  "connect-events",
  "create-call",
  "delete-any-message",
  "delete-channel",
  "delete-own-message",
  "flag-message",
  "freeze-channel",
  "join-call",
  "join-channel",
  "leave-channel",
  "mute-channel",
  "pin-message",
  "quote-message",
  "read-events",
  "search-messages",
  "send-custom-events",
  "send-links",
  "send-message",
  "send-reaction",
  "send-reply",
  "send-typing-events",
  "set-channel-cooldown",
  "skip-slow-mode",
  "slow-mode",
  "typing-events",
  "update-any-message",
  "update-channel",
  "update-channel-members",
  "update-own-message",
  "upload-file",
];
