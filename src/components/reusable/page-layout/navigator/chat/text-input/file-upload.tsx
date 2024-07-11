import clsx from "clsx";
import { FilePlus, ImagePlusIcon, PaperclipIcon } from "lucide-react";
import React, { type RefObject, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMessageInputContext } from "stream-chat-react";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { toast } from "@/src/components/reusable/toaster/toast";
import { toolsIcon } from "@/src/components/slate";
import type { StreamChatGenerics } from "../types";

const FILE_SIZE_LIMIT = 10485760; // 10Mb

const FileUpload = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("page");
  const { uploadNewFiles } = useMessageInputContext<StreamChatGenerics>();
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = (ref: RefObject<HTMLInputElement>) => () => {
    if (ref.current?.files) {
      const files = ref.current.files;
      const exceedsLimit = Array.from(files).some(
        (i) => i.size > FILE_SIZE_LIMIT,
      );

      if (exceedsLimit) {
        toast.warning("chat.message.input.file_warning_title", {
          description: replaceVariablesInString(
            t("chat.message.input.file_warning_description"),
            ["10 MB"],
          ),
        });
        setOpen(false);
        return;
      }

      uploadNewFiles(files);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <PaperclipIcon size={16} className={clsx(toolsIcon)} />
      </PopoverTrigger>
      <PopoverContent
        className="!w-auto border border-border bg-background !p-0 text-sm"
        align="end"
      >
        <button
          className="flex w-full cursor-pointer items-center space-x-2 p-2 hover:bg-accent"
          onClick={() => fileRef.current?.click()}
        >
          <FilePlus size={18} />
          <span>{t("chat.message.input.upload.file")}</span>
        </button>
        <button
          className="flex w-full cursor-pointer space-x-2 p-2 hover:bg-accent"
          onClick={() => mediaRef.current?.click()}
        >
          <ImagePlusIcon size={18} />
          <span>{t("chat.message.input.upload.image")}</span>
        </button>
        <input
          type="file"
          onChange={handleUploadFile(fileRef)}
          accept="audio/*, video/*, text/*, application/*"
          ref={fileRef}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadFile(mediaRef)}
          ref={mediaRef}
          className="hidden"
        />
      </PopoverContent>
    </Popover>
  );
};

export default FileUpload;
