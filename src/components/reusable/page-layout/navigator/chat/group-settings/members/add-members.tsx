import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useChatContext } from "stream-chat-react";
import { useGetOtherMembersOfChannel } from "@/src/client-functions/client-chat";
import Loader from "@/src/components/loader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/reusable/shadcn-ui/command";
import UserDefaultImage from "@/src/components/user-default-image";
import { filterUndefined } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { useChannelHeaderContext } from "../../channel-header";
import type { StreamChatGenerics } from "../../types";

const AddMembers = () => {
  const { client } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelHeaderContext();
  const { getOtherMembers } = useGetOtherMembersOfChannel();
  const { t } = useTranslation("page");
  const otherMembers = getOtherMembers(channel);

  const queryKey = [
    "getstream",
    "users-search",
    otherMembers.reduce((p, c) => `${p}:${c.user?.id}`, ""),
  ];

  const { user: authUser } = useUser();
  const { data, isLoading } = useQuery(queryKey, {
    queryFn: () =>
      client.queryUsers(
        {
          id: {
            $nin: [
              ...otherMembers.map((i) => i.user?.id).filter(filterUndefined),
              authUser.id,
            ],
          },
          teams: {
            $contains: authUser.currentInstitutionId,
          },
        },
        {},
        { limit: 100 },
      ),
  });

  return (
    <Command onClick={(e) => e.stopPropagation()}>
      <CommandInput
        placeholder={t("chat.group_settings.members.filter_user")}
        autoFocus={true}
        className="h-9"
      />
      <CommandList className="min-h-[32px]">
        <CommandEmpty>
          <span className={clsx(isLoading && "hidden")}>
            {t("chat.group_settings.members.no_users_found")}
          </span>
        </CommandEmpty>
        <CommandGroup className="!m-0 !px-0 !pb-0">
          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {data?.users.map((user) => {
            return (
              <CommandItem
                key={user.id}
                className="group flex cursor-pointer items-center justify-between"
                onSelect={async () => {
                  try {
                    await channel.addMembers([user.id]);
                    await channel.sendMessage({
                      systemMessageType: "channel.member.new",
                      type: "system",
                      text: user.name,
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <UserDefaultImage
                    user={{ id: user.id, image: user.image }}
                    dimensions="h-5 w-5"
                  />
                  <span>{user.name}</span>
                </div>
                <Plus
                  size={15}
                  className="hidden text-muted-contrast group-hover:block"
                />
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AddMembers;
