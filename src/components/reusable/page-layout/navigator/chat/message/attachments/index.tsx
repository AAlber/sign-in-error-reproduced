import cuid from "cuid";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import type { StreamMessage } from "stream-chat-react";
import useUser from "@/src/zustand/user";
import type { StreamChatGenerics } from "../../types";
import FileAttachment from "./file";
import LinkAttachment from "./link";
import PhotoAttachment from "./photo";
import VideoAttachment from "./video";

const MessageAttachments = (props: {
  message: StreamMessage<StreamChatGenerics>;
}) => {
  const { user: user } = useUser();
  const { message } = props;
  const [isGiphyLoaded, setGiphyLoaded] = useState(false);
  const attachments = useMemo(() => message.attachments, []);

  const isMyMessage = message.user?.id === user.id;
  const hasAttachments = !!attachments?.some((i) => typeof i.type === "string");

  if (!hasAttachments) return null;
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="message-attachment flex flex-wrap items-start justify-start gap-2">
      {attachments?.map((i) => {
        const imgUrl = i.image_url || i.thumb_url || i.og_scrape_url || "";
        const url = i.title_link || i.asset_url || i.og_scrape_url;
        const hasDescription = !!i.title && !!i.text;
        if (!i.type || !url) return null;
        switch (i.type) {
          case "image": {
            // Render file attachment if image is an SVG
            if (i.title?.includes(".svg")) {
              return (
                <FileAttachment
                  attachment={i}
                  imgUrl={imgUrl}
                  key={cuid()}
                  url={url}
                />
              );
            }

            if (i.text) {
              return (
                <LinkAttachment
                  attachment={i}
                  hasDescription={hasDescription}
                  imgUrl={imgUrl}
                  isMyMesssage={isMyMessage}
                  key={cuid()}
                  url={url}
                />
              );
            }

            return (
              <PhotoAttachment
                attachment={i}
                imgUrl={imgUrl}
                key={cuid()}
                url={url}
              />
            );
          }
          case "video": {
            return (
              <VideoAttachment
                attachment={i}
                isMyMesssage={isMyMessage}
                hasDescription={hasDescription}
                imgUrl={imgUrl}
                key={cuid()}
                url={url}
              />
            );
          }
          case "file": {
            return (
              <FileAttachment
                attachment={i}
                imgUrl={imgUrl}
                key={cuid()}
                url={url}
              />
            );
          }
          case "gif": {
            return (
              <div className="relative text-clip rounded-md" key={cuid()}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block h-auto min-h-[200px] w-[240px]"
                >
                  <Image
                    alt={i.title ?? ""}
                    src={i.image_url ?? ""}
                    fill
                    onLoad={() => {
                      setGiphyLoaded(true);
                    }}
                  />
                  {isGiphyLoaded && (
                    <Image
                      alt="powered-by-giphy"
                      src="/images/powered-by-giphy-logo-dark.png"
                      className="absolute bottom-2 right-0"
                      width={134}
                      height={134}
                    />
                  )}
                </a>
              </div>
            );
          }
          default: {
            // TODO!: Remove on prod
            return (
              <div className="text-sm text-destructive" key={cuid()}>
                <pre>{JSON.stringify(i, null, 4)}</pre>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default React.memo(MessageAttachments);
