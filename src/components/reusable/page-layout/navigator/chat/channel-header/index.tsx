import clsx from "clsx";
import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";
import type { Channel } from "stream-chat";
import {
  useGetOtherMembersOfChannel,
  useIsSomeoneOnline,
} from "@/src/client-functions/client-chat";
import { useUserInstitutions } from "@/src/client-functions/client-chat/useGetInstitutionsOfUser";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import GroupSettings from "../group-settings";
import OnlineIndicator from "../online-indicator";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";
import ActiveSince from "./active-since";
import PinnedMessages from "./pinned-messages";
import RenameChannel from "./rename-group";
import UpdateGroupEmoji from "./update-group-emoji";

const ChannelHeader = () => {
  const { navigateToTab } = useNavigation();
  const { currentChannel: channel } = useChat();
  const { getOtherMembers } = useGetOtherMembersOfChannel();
  const { isSomeoneOnlineInChannel } = useIsSomeoneOnline();
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { userInstitutions } = useUserInstitutions();

  const isGroupChat =
    !!channel?.data?.isGroupChat || channel?.type === "course";
  const isCourse = channel?.type === "course";

  if (!channel) return null;

  const courseIsFromAnotherInstitution =
    channel.type === "course" &&
    !!channel.data?.team &&
    channel.data.team !== user.currentInstitutionId;

  const isOnline = isSomeoneOnlineInChannel(channel);
  const otherMembers = getOtherMembers(channel);

  const handleNavigateToCourse = (e) => {
    if (!channel || channel.type !== "course" || !channel.id) return;
    e.stopPropagation();
    pageHandler.set.page("COURSES");
    navigateToTab(channel.id);
  };

  const renderView = () => {
    const hoverClass =
      isGroupChat || isCourse ? "cursor-pointer hover:opacity-60" : "";

    if (isGroupChat) {
      const onlineCount = otherMembers.reduce(
        (p, c) => p + +!!c.user?.online,
        0,
      );

      if (isCourse) {
        return (
          <WithToolTip text="course.navigation" side="bottom">
            <div
              className={clsx("relative flex space-x-2", hoverClass)}
              onClick={handleNavigateToCourse}
            >
              <UpdateGroupEmoji />
              <div className="flex flex-col text-sm">
                <RenameChannel />
                <div className="text-xs">
                  {courseIsFromAnotherInstitution && (
                    <span className="mr-1 text-primary">
                      {userInstitutions[channel.data?.team ?? ""]}
                    </span>
                  )}
                  <span className="text-muted-contrast">
                    {t("chat.group.online_now")}: {onlineCount}
                  </span>
                </div>
              </div>
            </div>
          </WithToolTip>
        );
      } else {
        return (
          <div
            className={clsx("relative flex space-x-2")}
            onClick={handleNavigateToCourse}
          >
            <WithToolTip
              text="change.group.chat.emoji"
              side="bottom"
              className="hover:opacity-60"
            >
              <UpdateGroupEmoji />
            </WithToolTip>

            <div className="flex flex-col text-sm">
              <WithToolTip
                text="rename.group"
                side="bottom"
                className="hover:opacity-60"
              >
                <RenameChannel />
              </WithToolTip>
              <div className="text-xs">
                <span className="text-primary">
                  {courseIsFromAnotherInstitution
                    ? userInstitutions[channel.data?.team ?? ""]
                    : ""}
                </span>
                <span className="text-muted-contrast">
                  {t("chat.group.online_now")}: {onlineCount}
                </span>
              </div>
            </div>
          </div>
        );
      }
    } else {
      const otherMember = otherMembers[0];
      const name = otherMember?.user?.name;
      const image = otherMember?.user?.image;
      const id = otherMember?.user?.id;

      return (
        <div className="flex space-x-2">
          <div className={`relative h-[2rem] w-[2rem] ${hoverClass}`}>
            <UserDefaultImage
              dimensions="h-[2rem] w-[2rem]"
              user={{ image, id }}
            />
            <OnlineIndicator
              isOnline={isOnline}
              absolutePosition="bottom-[1px] right-[5px]"
            />
          </div>
          <div className={`flex flex-col text-sm`}>
            <span className="text-contrast">{name}</span>
            <ActiveSince
              isOnline={isOnline}
              lastActive={otherMember?.user?.last_active}
            />
          </div>
        </div>
      );
    }
  };

  if (!channel) return null;
  return (
    <ChannelHeaderContext.Provider value={{ channel }}>
      <div>
        <div
          className="relative flex items-center justify-between px-1 py-2"
          onWheel={(e) => e.stopPropagation()}
        >
          {renderView()}
          {isGroupChat && <GroupSettings />}
        </div>
        <PinnedMessages />
      </div>
    </ChannelHeaderContext.Provider>
  );
};

export default ChannelHeader;

const ChannelHeaderContext = createContext<{
  channel: Channel<StreamChatGenerics>;
} | null>(null);

/**
 * Since with current layout the `ChannelHeader` component is not a child of `ChannelProvider` anymore,
 * and the `Channel` is now set through zustand, we just create a new ContextProvider here instead
 * for usage of all children of `ChannelHeader` component, it also and makes sure that `Channel` is never undefined
 */
export const useChannelHeaderContext = () => {
  const ctx = useContext(ChannelHeaderContext);
  if (!ctx?.channel)
    throw new Error("Must be used inside ChannelHeader component");

  return ctx;
};
