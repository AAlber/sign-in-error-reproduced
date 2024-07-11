import clsx from "clsx";
import cuid from "cuid";
import Image from "next/image";
import { AttachmentWrapper } from "./attachment-wrapper";

const VideoAttachment = (props: {
  attachment: any;
  hasDescription: boolean;
  imgUrl: string;
  isMyMesssage: boolean;
  url: string;
}) => {
  const { hasDescription, isMyMesssage, url, imgUrl } = props;
  const attachment = props.attachment;

  if (!attachment) return null;
  return (
    <AttachmentWrapper url={url} indent={hasDescription} key={cuid()}>
      <div className="mb-4">
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
      </div>
      <div className="relative flex h-[280px] w-full justify-start">
        <Image
          src={imgUrl}
          alt={attachment.title ?? ""}
          fill
          className="object-contain object-left"
        />
      </div>
    </AttachmentWrapper>
  );
};

export default VideoAttachment;
