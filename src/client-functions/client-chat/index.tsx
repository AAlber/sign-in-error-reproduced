import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { useCallback } from "react";
import type {
  Channel,
  ChannelMemberResponse,
  UpdateChannelAPIResponse,
} from "stream-chat";
import { useStreamChatContext } from "@/src/components/getstream";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import ToastNewChat from "@/src/components/reusable/toaster/custom-toasts/toast-new-chat";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { filterUndefined } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { browserNotificationHandler } from "../client-notification";
import {
  capitalize,
  decodeHtmlEntities,
  replaceVariablesInString,
} from "../client-utils";

/**
 * If token already exists in localstorage
 * then resolve with the token from localstorage, else fetch token from our api
 *  TODO: Token is valid indefinitely by default
 *  TODO: expire tokens?
 *  https://getstream.io/chat/docs/javascript/tokens_and_authentication/?language=javascript
 */

export function useGetChatChannelById() {
  const { client } = useStreamChatContext();
  const getChannelById = useCallback(
    async (id: string, type: "messaging" | "course" = "messaging") => {
      const channels = await client?.queryChannels({
        cid: `${type}:${id}`,
      });
      if (channels && !!channels.length) return channels[0];
    },
    [client],
  );

  return { getChannelById };
}

export async function addModerator(
  userId: string,
  channelId: string,
  channelType = "messaging",
): Promise<UpdateChannelAPIResponse<StreamChatGenerics>> {
  const data = await fetch(api.promoteToModerator, {
    method: "POST",
    body: JSON.stringify({ userId, channelId, channelType }),
  });

  const result = await data.json();
  return result;
}

export async function removeModerator(
  userId: string,
  channelId: string,
  channelType = "messaging",
): Promise<UpdateChannelAPIResponse<StreamChatGenerics>> {
  const data = await fetch(api.demoteAsModerator, {
    method: "POST",
    body: JSON.stringify({ userId, channelId, channelType }),
  });

  const result = await data.json();
  return result;
}

/**
 * Need to pass in `channel` as the prop here since we also use
 * this in the `channelList` component where we cannot use the
 * `useChannelStateContext` hook
 */
export function useGetOtherMembersOfChannel() {
  const { user: user } = useUser.getState();
  const getOtherMembers = (channel: Channel<StreamChatGenerics>) => {
    const members = channel.state.members;
    const ids = Object.keys(members);

    const otherMembers = ids.filter((id) => id !== user.id);
    return otherMembers
      .map((member) => members[member])
      .filter(filterUndefined);
  };

  return { getOtherMembers };
}

export function useIsSomeoneOnline() {
  const { user } = useUser();
  const { getOtherMembers } = useGetOtherMembersOfChannel();

  const isSomeoneOnlineInChannel = useCallback(
    (channel: Channel<StreamChatGenerics>) => {
      const otherMembers = getOtherMembers(channel);
      return !!otherMembers?.some((member) => !!member?.user?.online);
    },
    [user],
  );

  return { isSomeoneOnlineInChannel };
}

export function normalizeChatDateUi(
  date: string | Date | number | undefined,
  showTime = false,
  daysFormat: "dddd" | "ddd" = "dddd",
  hideDate = false,
) {
  const d = dayjs(date);
  const now = Date.now();
  const dayDiff = dayjs(now).diff(d, "days");
  const weekDiff = dayjs(now).diff(d, "w");

  if (hideDate) return d.format("HH:mm");
  return `${d.format(
    !dayDiff ? "HH:mm" : !!weekDiff ? "DD. MMM" : daysFormat,
  )}${showTime && !!dayDiff ? ` ${d.format("HH:mm")}` : ""}`;
}

export function createChannelNameFromGroup(
  members: Record<string, ChannelMemberResponse<StreamChatGenerics>>,
  spliceAt = 4,
  onlyFirstName = true,
  includeSelf = true,
) {
  const { user: user } = useUser.getState();
  let ids = Object.keys(members);
  ids = ids.filter((id) => id !== user.id);

  const names = ids.map((id) => {
    const name = capitalize(members[id]?.user?.name ?? "");
    const firstname = name.split(" ")[0] ?? name;
    return onlyFirstName ? firstname : name;
  });

  if (names.length > spliceAt) {
    const otherNames = names.splice(0, spliceAt);
    return `${otherNames.join(", ")}, and ${names.length + 1} others`;
  }

  if (includeSelf) {
    return `${names.join(", ")}${names.length > 1 ? ", " : ""} and You`;
  } else if (names.length === 2) {
    return `${names.join(" and ")}`;
  } else {
    const last = names.pop();
    return `${names.join(", ")}, and ${last}`;
  }
}

export function reduceNamesFromUsersArray<T extends SimpleUser[]>(users: T) {
  return users.reduce((p, c, idx) => {
    const user = c.name || c.email || "";
    return users.length === 1 || idx === 0
      ? user
      : idx !== users.length - 1
      ? `${p}, ${user}`
      : `${p}${users.length > 2 ? "," : ""} and ${user}`;
  }, "");
}

export function getTextFromHtml(text: string) {
  const tempDoc = document.createElement("span");
  tempDoc.innerHTML = text;
  const innerText = tempDoc.innerText;
  tempDoc.remove();

  return decodeHtmlEntities(innerText);
}

export type NotifyArgs = {
  description: string;
  isWindowVisible: boolean;
  sender: string;
  senderId?: string;
  senderImage?: string;
  title: string; // can be the name of sender
  onClick: () => void;
  translate: TFunction;
};

export function notifyNewMessage({
  title,
  isWindowVisible,
  description,
  sender,
  senderId,
  senderImage,
  onClick,
  translate,
}: NotifyArgs) {
  const user =
    senderId && senderImage ? { id: senderId, image: senderImage } : undefined;

  toast.custom((props) => (
    <ToastNewChat
      {...props}
      description={description}
      onClick={onClick}
      title={title}
      user={user}
    />
  ));

  // only fire browser notification when tab is not visible
  if (!isWindowVisible) {
    browserNotificationHandler({
      message: description,
      title: replaceVariablesInString(
        translate("notifications.sent_you_a_message"),
        [sender],
      ),
      icon: "/logo.svg",
    })?.addEventListener("click", () => {
      window.open(location.origin);
    });
  }
}
