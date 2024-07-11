import { PaperclipIcon } from "lucide-react";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMessageInputContext } from "stream-chat-react";
import { useChatDragAndDropContext } from "@/src/components/reusable/page-layout/navigator/chat/text-input/drag-and-drop-provider";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

type Props = {
  setMenuOpen: (bool: boolean) => void;
};

export default function MenuItemFile({ setMenuOpen }: Props) {
  const { canUploadFiles } = useChatDragAndDropContext();
  const { uploadNewFiles } = useMessageInputContext();
  const { t } = useTranslation("page");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = (files: FileList) => {
    if (files[0]) {
      uploadNewFiles(files);
    }
  };

  if (!canUploadFiles) return null;
  return (
    <DropdownMenuItem asChild>
      <>
        <button
          className="group flex w-full cursor-pointer items-center justify-start space-x-2 rounded-md px-2.5 py-1.5 text-sm hover:bg-accent/50"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          <PaperclipIcon className="h-4 w-4 text-muted-contrast group-hover:text-contrast" />
          <span>{t("file")}</span>
        </button>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleUploadFile(e.target.files);
            }
            setMenuOpen(false);
          }}
        />
      </>
    </DropdownMenuItem>
  );
}
