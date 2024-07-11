import clsx from "clsx";
import cuid from "cuid";
import Image from "next/image";
import classNames from "@/src/client-functions/client-utils";
import { AttachmentWrapper } from "./attachment-wrapper";

const LinkAttachment = (props: {
  attachment: any;
  url: string;
  hasDescription: boolean;
  imgUrl: string;
  isMyMesssage?: boolean;
}) => {
  const { hasDescription, url, imgUrl, isMyMesssage = false } = props;
  const attachment = props.attachment;

  if (!attachment) return null;
  return (
    <AttachmentWrapper indent={hasDescription} key={cuid()} url={url}>
      {attachment.text && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mb-4 text-left text-sm"
          style={{ wordBreak: "break-word" }}
        >
          <p
            className={clsx(
              "font-bold hover:underline",
              isMyMesssage ? "text-white" : "text-primary",
            )}
          >
            {attachment.title}
          </p>
          <p
            className={clsx(
              "text-sm",
              isMyMesssage ? "text-white" : "text-secondary-contrast",
            )}
          >
            {attachment.text}
          </p>
          <div className="relative flex h-[240px] min-w-[240px] justify-start overflow-hidden rounded-lg">
            <Image
              src={imgUrl}
              fill
              alt={attachment.title || imgUrl}
              className={classNames(
                hasDescription ? "object-contain" : "object-cover",
                "object-left",
              )}
              placeholder="empty"
            />
          </div>
        </a>
      )}
    </AttachmentWrapper>
  );
};

export default LinkAttachment;
