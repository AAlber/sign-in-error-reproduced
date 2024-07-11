import Image from "next/image";
import { useMemo } from "react";
import {
  useChannelStateContext,
  useMessageInputContext,
} from "stream-chat-react";
import type { StreamChatGenerics } from "../../types";
import CancelButton from "./cancel-button";
import CustomLoader from "./loader";

const ImageUploads = () => {
  const { imageUploads, removeImage } =
    useMessageInputContext<StreamChatGenerics>();
  const ctx = useChannelStateContext();

  const handleDeleteImage = (url: string, id: string) => () => {
    ctx.channel
      .deleteImage(url)
      .then(() => {
        removeImage(id);
      })
      .catch(console.log);
  };

  const imgs = useMemo(() => {
    return Object.values(imageUploads ?? {}).map((img) => img);
  }, [imageUploads]);

  if (!imgs.length) return null;
  return (
    <>
      {imgs.map((i) => {
        const url = i.previewUri || i.url || i.og_scrape_url || "";
        return (
          <div
            className="group relative h-16 w-16 cursor-pointer items-start justify-start opacity-80 transition-opacity hover:opacity-100"
            key={i.id}
          >
            <CancelButton onClick={handleDeleteImage(url, i.id)} />
            <Image
              alt={i.file.name}
              src={i.previewUri || i.url || i.og_scrape_url || ""}
              fill
              className="rounded-md border border-border object-cover object-left"
              quality={1}
            />
            {i.state === "uploading" && <CustomLoader />}
          </div>
        );
      })}
    </>
  );
};

export default ImageUploads;
