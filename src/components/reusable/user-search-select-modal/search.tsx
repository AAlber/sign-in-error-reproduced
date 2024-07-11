import type { User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, UserRoundX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { getUsersOfLayer } from "@/src/client-functions/client-user";
import classNames from "@/src/client-functions/client-utils";
import { useThrottle } from "@/src/client-functions/client-utils/hooks";
import Spinner from "../../spinner";
import UserDefaultImage from "../../user-default-image";
import { AutoLayerCourseIconDisplay } from "../course-layer-icons";
import { EmptyState } from "../empty-state/empty-state";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn-ui/command";
import WithTooltip from "../with-tooltip";
import type { BaseUser, SearchComponentProps } from "./types";

export default function Search<T extends BaseUser>({
  selectedResults,
  throttleRequests = true,
  onSelectResult,
  ...props
}: SearchComponentProps<T>) {
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string>();
  const { t } = useTranslation("page");
  const { ref, inView } = useInView();
  const throttledValue = useThrottle(query, throttleRequests ? 1000 : 0);

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<User[] | T[]>({
    queryKey: [
      "users-search",
      !props.customFetcher ? props.layerId : props.customFetcher.name,
      throttledValue,
    ],
    queryFn: ({ pageParam = "" }) => {
      if (props.customFetcher) return props.customFetcher(throttledValue);
      return getUsersOfLayer({
        layerId: props.layerId,
        role: props.role,
        search: throttledValue,
        cursor: pageParam,
        take: 20,
      });
    },
    keepPreviousData: true,
    onSuccess(data) {
      const id = data.pages.at(-1)?.at(-1)?.id;
      setNextCursor(id);
    },
    getNextPageParam: (lastPage) => {
      if (!!throttledValue || props.customFetcher) return undefined;
      return lastPage?.at(-1)?.id;
    },
    staleTime: 60000 * 1,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, inView, fetchNextPage]);

  const selectedResultIds = selectedResults.map((result) => result.id);

  const hasOnlyUnregisteredUsers = (page) =>
    page.every((user) => user.disabled === true);

  const allUnregistered =
    data?.pages?.every(hasOnlyUnregisteredUsers) &&
    data.pages.every(
      (page) => page.length > 0 && hasOnlyUnregisteredUsers(page),
    );

  return (
    <Command
      className="grow rounded-t-none border-t border-border"
      shouldFilter={false}
    >
      <CommandInput
        placeholder={t("general.search.user")}
        value={query}
        onValueChange={setQuery}
        maxLength={80}
      />
      <CommandList className="!max-h-full">
        {allUnregistered && (
          <div className="p-2 text-left text-sm text-muted-contrast">
            {t("general.unregistered")}
          </div>
        )}
        {!!error ? (
          <div className="p-2 text-sm">{t("something_went_wrong")}</div>
        ) : (
          <>
            {data?.pages?.length ? (
              <CommandGroup
                className={classNames(
                  isLoading || isFetchingNextPage
                    ? "opacity-60"
                    : "opacity-100",
                  "transition-opacity",
                )}
              >
                {data.pages.map((page) =>
                  page.map((p) => {
                    const d = p as T;
                    const isDisabled = d.disabled === true;
                    if (!query && isDisabled) return null;

                    return (
                      <CommandItem
                        key={d.id}
                        className={classNames(
                          "relative flex items-center px-2",
                          isDisabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer",
                        )}
                        disabled={isDisabled}
                        value={d.id}
                        onSelect={() => {
                          if (!isDisabled) onSelectResult(d);
                        }}
                        ref={d.id === nextCursor ? ref : undefined}
                      >
                        <div className="size-8">
                          {d.email?.startsWith("course") ? (
                            <AutoLayerCourseIconDisplay
                              course={{ icon: d.image }}
                              className="flex size-7 text-3xl"
                            />
                          ) : (
                            <UserDefaultImage
                              user={{ id: d.id, image: d.image ?? "" }}
                              dimensions="h-7 w-7"
                            />
                          )}
                        </div>
                        <div className="ml-2 flex w-full items-center justify-between text-sm">
                          {isDisabled ? (
                            <WithTooltip
                              text={t("unregistered.user.chat.tooltip")}
                              side="right"
                            >
                              <div>
                                <p className="font-medium leading-none">
                                  {d.name}
                                </p>
                                <p className="text-xs text-muted-contrast">
                                  {d.email}
                                </p>
                              </div>
                            </WithTooltip>
                          ) : (
                            <div>
                              <p className="font-medium leading-none">
                                {d.name}
                              </p>
                              <p
                                className={classNames(
                                  "text-xs text-muted-contrast",
                                  d.email?.startsWith("course") && "capitalize",
                                )}
                              >
                                {d.email}
                              </p>
                            </div>
                          )}
                          {isDisabled && <p>{t("general.unregistered")}</p>}
                          <Check
                            className={classNames(
                              "absolute right-2 ml-auto flex h-5 w-5 text-primary",
                              selectedResultIds.includes(d.id)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </div>
                      </CommandItem>
                    );
                  }),
                )}
              </CommandGroup>
            ) : null}
            {data?.pages?.length === 0 ||
              (data?.pages?.[data.pages.length - 1]?.length === 0 && (
                <EmptyState
                  className="pt-20"
                  icon={UserRoundX}
                  title={t("chat.search.empty.title")}
                  description={t("chat.search.empty.description")}
                />
              ))}
          </>
        )}
        {isLoading && (
          <div className="absolute bottom-20 right-2">
            <Spinner />
          </div>
        )}
      </CommandList>
    </Command>
  );
}
