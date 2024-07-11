import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import type { MultiResponse, SingleResponse } from "giphy-api";
import debounce from "lodash/debounce";
import { SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { useChannelActionContext } from "stream-chat-react";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import Skeleton from "@/src/components/skeleton";
import type { StreamChatGenerics } from "../types";
import useChat from "../zustand";

type QueryField = {
  query: string;
};

// TODO: Update component
const Giphy = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { sendMessage } = useChannelActionContext<StreamChatGenerics>();
  const { giphy, setGiphy } = useChat();
  const isDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const isOpen = pageHandler.get.currentPage().titleKey !== "CHAT";

  const { control, handleSubmit, reset, setFocus } = useForm<QueryField>({
    defaultValues: {
      query: giphy.value ?? "",
    },
  });

  useEffect(() => {
    setIsMounted(giphy.isOpen);
  }, [giphy.isOpen]);

  useEffect(() => {
    reset({ query: giphy.value });
    setFocus("query");
  }, [giphy.value]);

  const key = [`giphy-${giphy.value}`];
  const { isLoading, data } = useQuery({
    queryKey: key,
    enabled: giphy.isOpen,
    staleTime: Infinity,
    queryFn: () => fetcher(giphy.value),
  });

  const handleSearch = debounce(
    handleSubmit((v) => {
      setGiphy({ isOpen: true, value: v.query });
    }),
    500,
  );

  const handleUnmount = (delay = 100) => {
    setIsMounted(false);
    setTimeout(() => {
      setGiphy({ isOpen: false, value: "" });
    }, delay);
  };

  const handleSend = (data: SingleResponse["data"]) => async () => {
    const img = (data as any).images.preview_webp ?? data.images.preview_gif;

    await sendMessage({
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
    }).catch(console.log);
    handleUnmount();
  };

  if (!giphy.isOpen) return null;
  return (
    <div
      className={clsx(
        "relative z-0 w-full border-t border-border transition-all duration-200",
        isMounted ? "translate-y-0 opacity-100" : "translate-y-full",
        isOpen ? "p-2" : "my-4 rounded-md border px-4 pb-4 pt-3",
      )}
    >
      <div
        className={clsx(
          "absolute -top-6 flex w-full justify-end text-muted-contrast",
          isOpen ? "right-4" : "right-0",
        )}
      >
        <button onClick={() => handleUnmount()}>
          <XIcon className="size-5" />
        </button>
      </div>
      <div
        className={clsx("mb-2 flex items-center bg-foreground text-contrast")}
      >
        <Controller
          control={control}
          name="query"
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <>
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter a GIF"
                  className={clsx(
                    "w-full border-0 border-b-2 border-border bg-transparent px-2 pr-7 outline-none ring-0 transition-colors placeholder:text-muted focus:border-primary focus:outline-none focus:ring-0",
                    !isOpen && "rounded-t-xl",
                  )}
                  onKeyUp={handleSearch}
                  {...field}
                />
                <SearchIcon
                  className={clsx(
                    "absolute size-5 text-muted-contrast",
                    isOpen ? "right-4" : "right-6",
                  )}
                />
              </>
            );
          }}
        />
      </div>
      <div
        className={clsx(
          "flex h-[40vh] w-full justify-center border-border",
          isOpen ? "max-h-[500px] pb-[28px]" : "pb-[18px]",
        )}
      >
        {isLoading ? (
          <Skeleton />
        ) : (
          <div
            className={clsx(
              "relative grid w-full gap-2 overflow-y-scroll",
              isOpen ? "grid-cols-3" : "grid-cols-5",
            )}
          >
            {data?.map((i) => {
              const img =
                (i.images as any).preview_webp ?? i.images.preview_gif;

              return (
                <div
                  key={i.id}
                  className={clsx(
                    isOpen ? "h-[100px] w-auto" : "h-[160px] w-auto",
                  )}
                >
                  <Image
                    className="size-full cursor-pointer object-cover"
                    alt={i.slug}
                    src={img.url}
                    height={img.height}
                    width={img.width}
                    onClick={handleSend(i)}
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        className={clsx(
          "absolute bottom-2.5 flex justify-end pl-4 transition-opacity",
          isOpen ? "right-1" : "right-3",
          isLoading ? "opacity-30" : "opacity-100",
        )}
      >
        <Image
          src={
            isDark
              ? "/images/powered-by-giphy-logo-dark.png"
              : "/images/powered-by-giphy-logo-light.png"
          }
          alt="powered-by-giphy"
          width={130}
          height={130}
        />
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
