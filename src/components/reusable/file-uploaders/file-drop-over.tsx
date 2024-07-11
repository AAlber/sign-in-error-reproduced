import type { UploadResult } from "@uppy/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { maxFileSizes } from "@/src/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../shadcn-ui/popover";
import { FileDropField } from "./file-drop-field";
import type { UploaderData } from "./zustand";

// Use this if you want to use the file drop in a modal
export default function FileDropover({
  children,
  onUploadFinish,
  onUploadCompleted,
  maxFileAmount = 1,
  minFileAmount = 1,
  title = "file_drop_title",
  description = "file_drop_description",
  allowedFileTypes,
  autoProceed = false,
  maxFileSize = maxFileSizes.fallback, // 300 MB fallback
  uploadPathData,
  sizeUpdater,
  closeDropOverOnFinish,
}: UploaderData & {
  closeDropOverOnFinish?: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation("page");
  // This is so that it is not required to create open state everywhere
  // since separate states are only needed in the workbench
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">{children}</PopoverTrigger>
      <PopoverContent className="w-[435px]">
        <div className="w-[400px]">
          <PopoverHeader>
            <PopoverTitle>{t(title)}</PopoverTitle>
            <PopoverDescription>{t(description)}</PopoverDescription>
          </PopoverHeader>
          <div className="h-2"></div>
          <FileDropField
            onUploadFinish={async (result: UploadResult) => {
              onUploadFinish && onUploadFinish(result);
              closeDropOverOnFinish && setOpen(false);
            }}
            onUploadCompleted={(urls: string[] | string) => {
              onUploadCompleted && onUploadCompleted(urls as any);
            }}
            sizeUpdater={(result: UploadResult) => {
              sizeUpdater && sizeUpdater(result);
            }}
            maxFileAmount={maxFileAmount}
            minFileAmount={minFileAmount}
            autoProceed={autoProceed}
            allowedFileTypes={allowedFileTypes}
            maxFileSize={maxFileSize}
            uploadPathData={uploadPathData}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
