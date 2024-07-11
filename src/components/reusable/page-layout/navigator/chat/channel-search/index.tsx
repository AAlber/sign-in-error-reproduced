import { useQueries } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { StreamChat } from "stream-chat";
import { useChatContext } from "stream-chat-react";
import { useThrottle } from "@/src/client-functions/client-utils/hooks";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import Spinner from "@/src/components/spinner";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";
import ChannelSearchItem from "./channel-item";
import UserSearchItem from "./user-item";

export default function ChannelSearch() {
  const [query, setQuery] = useState("");
  const { client } = useChatContext<StreamChatGenerics>();
  const { setIsSearching } = useChat();
  const { control, setFocus } = useForm<{ value: string }>();
  const { t } = useTranslation("page");

  const throttledValue = useThrottle(query, 1000);

  useEffect(() => {
    setFocus("value");
    const closeOnEscape = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setIsSearching(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const staleTime = 60000 * 5;
  const keepPreviousData = true;

  const [channelsSearch, usersSearch] = useQueries({
    queries: [
      {
        queryKey: ["getstream", "channel-search", throttledValue],
        queryFn: () => queryChannels(client, throttledValue),
        staleTime,
        keepPreviousData,
      },
      {
        queryKey: ["getstream", "users-search", throttledValue],
        queryFn: async () => queryUsers(client, throttledValue),
        staleTime,
        keepPreviousData,
        enabled: !!query,
      },
    ],
  });

  return (
    <div
      id="main-chat-channel-search"
      className="relative flex h-full flex-col space-y-4"
    >
      <div className="flex items-center space-x-1">
        <div className="relative flex w-full items-center">
          <Controller
            control={control}
            name="value"
            render={({ field }) => {
              const { onChange, ...rest } = field;
              return (
                <Input
                  {...rest}
                  placeholder={t("chat.search_placeholder")}
                  onChange={(e) => {
                    onChange(e);
                    // we also update local state so we can also throttle query value
                    setQuery(e.target.value);
                  }}
                />
              );
            }}
          />
          {(channelsSearch.isFetching || usersSearch.isFetching) && (
            <div className="absolute right-0 top-1.5">
              <Spinner />
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSearching(false)}
          className="pl-1 text-muted-contrast transition-colors hover:text-contrast"
        >
          <XIcon size={14} />
        </button>
      </div>
      <div className="max-h-[90vh] overflow-y-scroll pb-24">
        {channelsSearch.data?.map((d) => (
          <ChannelSearchItem key={d.id} channel={d} />
        ))}
        {!!query &&
          usersSearch.data?.map((d) => <UserSearchItem key={d.id} user={d} />)}
      </div>
    </div>
  );
}

export async function queryChannels(
  client: StreamChat<StreamChatGenerics>,
  autoCompleteQuery?: string,
) {
  const { user } = useUser.getState();
  const joinedInstitutions = client.user?.teams ?? [user.currentInstitutionId];

  return await client.queryChannels(
    {
      type: {
        $in: ["course", "messaging"],
      },
      members: {
        $in: [user.id],
      },
      joined: true,
      last_message_at: {
        $lte: new Date().toISOString(),
      },
      ...(user.currentInstitutionId
        ? { team: { $in: joinedInstitutions } }
        : {}),
      // fetch all channels when there is not search input
      ...(autoCompleteQuery
        ? {
            name: { $autocomplete: autoCompleteQuery },
            // also show hidden channels when there is search input
            $or: [{ hidden: true }, { hidden: false }],
          }
        : {}),
    },
    undefined,
    {
      limit: 99,
      state: true,
      watch: true,
    },
  );
}

async function queryUsers(
  client: StreamChat<StreamChatGenerics>,
  autoCompleteQuery?: string,
) {
  if (!autoCompleteQuery) return [];
  const { user } = useUser.getState();
  const joinedInstitutions =
    client.user?.teams ??
    (!!user.currentInstitutionId ? [user.currentInstitutionId] : []);

  const result = await client.queryUsers({
    teams: { $in: joinedInstitutions } as any,
    id: { $ne: user.id },
    $or: [
      { name: { $autocomplete: autoCompleteQuery } },
      { email: { $eq: autoCompleteQuery } },
    ],
  });

  return result.users;
}
