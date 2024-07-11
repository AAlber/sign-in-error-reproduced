import React from "react";
import { useTranslation } from "react-i18next";
import { useMessageInputContext } from "stream-chat-react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useHandleSubmitMessage } from "@/src/components/slate";
import DragAndDropOverlay from "./drag-and-drop-overlay";

export default function Options() {
  const { uploadNewFiles } = useMessageInputContext();
  const { handleSubmit } = useHandleSubmitMessage();

  const { t } = useTranslation("page");

  const handleUploadFile = (files: FileList) => {
    if (files[0]) {
      uploadNewFiles(files);
    }
  };

  return (
    <div className="hidden md:block">
      <div className="flex w-full items-center justify-between">
        <Button variant={"cta"} onClick={handleSubmit}>
          {t("general.send")}
        </Button>
      </div>
      <DragAndDropOverlay onFileDrop={handleUploadFile} />
    </div>
  );
}
