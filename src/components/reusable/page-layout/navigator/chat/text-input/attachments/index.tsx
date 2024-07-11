import React from "react";
import { useMessageInputContext } from "stream-chat-react";
import type { StreamChatGenerics } from "../../types";
import FileUploads from "./file-uploads";
import ImageUploads from "./image-uploads";

const InputAttachments = () => {
  // TODO: Fix useMessageInputContext warning
  const { fileUploads, imageUploads } =
    useMessageInputContext<StreamChatGenerics>();

  const fileUploadKeys = Object.keys(fileUploads ?? {});
  const imageUploadKeys = Object.keys(imageUploads ?? {});

  if (fileUploadKeys.length || imageUploadKeys.length) {
    return (
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <ImageUploads />
        <FileUploads />
      </div>
    );
  }

  return null;
};

export default InputAttachments;
