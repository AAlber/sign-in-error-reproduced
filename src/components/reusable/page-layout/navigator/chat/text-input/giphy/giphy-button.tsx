import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import type { MultiResponse, SingleResponse } from "giphy-api";
import debounce from "lodash/debounce";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChannelStateContext } from "stream-chat-react";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import Skeleton from "@/src/components/skeleton";

type QueryField = {
  query: string;
};

const Giphy = (props: {
  search: string | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { search, setOpen, setSearch } = props;
  const { channel, thread } = useChannelStateContext<StreamChatGenerics>();
  const { t } = useTranslation("page");

  const { control, handleSubmit, reset, setFocus } = useForm<QueryField>({
    defaultValues: {
      query: search ?? "",
    },
  });

  useEffect(() => {
    reset({ query: search });
    setFocus("query");
  }, [search]);

  const key = [`giphy-${search}`];
  const { isLoading, data } = useQuery({
    queryKey: key,
    staleTime: Infinity,
    queryFn: () => fetcher(search ?? ""),
  });

  const handleSearch = debounce(
    handleSubmit((v) => {
      setSearch(v.query);
    }),
    500,
  );

  const isReplying = thread?.id ? { parent_id: thread.id } : {};

  const handleSend = (data: SingleResponse["data"]) => async () => {
    const img = data.images.original;
    channel
      .sendMessage({
        ...isReplying,
        attachments: [
          {
            image_url: img.url,
            original_height: +img.height,
            original_width: +img.width,
            title: data.title,
            type: data.type,
            asset_url: data.url,
          },
        ],
      })
      .catch(console.log);

    setOpen(false);
  };

  return (
    <div className="flex flex-col">
      <div className="relative mb-2 flex items-center text-contrast">
        <Controller
          control={control}
          name="query"
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <input
                type="text"
                autoFocus
                placeholder={t("general.search")}
                className="block h-9 w-full min-w-0 grow rounded-md border border-border bg-background outline-none ring-0 focus:border-primary focus:ring-0"
                onKeyUp={handleSearch}
                {...field}
              />
              <SearchIcon
                className={clsx(
                  "absolute right-2 h-4 w-4 text-muted-contrast transition-opacity",
                  isLoading && "opacity-30",
                )}
              />
            </>
          )}
        />
      </div>
      <div className="flex h-[50vh] max-h-[640px] w-[290px] grow justify-center">
        {isLoading ? (
          <Skeleton />
        ) : (
          <div
            className={clsx("grid grow grid-cols-3 gap-1 overflow-y-scroll")}
          >
            {data?.map((i) => {
              const img = i.images.preview_gif as any;
              return (
                <div key={i.id} className={clsx("relative aspect-square")}>
                  <Image
                    className="h-full w-full cursor-pointer object-cover brightness-90 transition-all hover:brightness-150"
                    alt={i.slug}
                    src={img.url}
                    height={img.height}
                    width={img.width}
                    loading="lazy"
                    onClick={handleSend(i)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        className={clsx(
          "ml-auto flex items-center justify-center pt-2 text-xs text-muted-contrast transition-opacity",
          isLoading ? "opacity-30" : "opacity-100",
        )}
      >
        {t("chat.toolbar.giphy.powered_by")}{" "}
        <span className="ml-1 font-bold">GIPHY</span>
      </div>
    </div>
  );
};
export default Giphy;

async function fetcher(q: string) {
  const response = await fetch(
    `/api/chat/giphy?search=${q || "random"}&limit=24`,
  );
  const data = (await response.json()) as MultiResponse["data"];
  return data;
}
