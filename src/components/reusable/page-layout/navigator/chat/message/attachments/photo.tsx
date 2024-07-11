import cuid from "cuid";
import Image from "next/image";
import classNames from "@/src/client-functions/client-utils";
import { AttachmentWrapper } from "./attachment-wrapper";

const PhotoAttachment = (props: {
  attachment: any;
  url: string;
  imgUrl: string;
}) => {
  const { url, imgUrl } = props;
  const attachment = props.attachment;

  if (!attachment) return null;
  return (
    <AttachmentWrapper key={cuid()} openInModal url={url} indent={false}>
      <div className="relative flex h-16 min-w-16 justify-start overflow-hidden rounded-md bg-muted">
        <Image
          src={imgUrl}
          fill
          alt={attachment.title || imgUrl}
          className={classNames("object-cover", "object-center")}
          placeholder="empty"
        />
      </div>
    </AttachmentWrapper>
  );
};

export default PhotoAttachment;
