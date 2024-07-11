import type { UppyFile } from "@uppy/core";
import cuid from "cuid";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import CircularProgress from "../../reusable/circular-progress";
import useFileDrop from "../../reusable/file-uploaders/zustand";

export const ExpandIcon = function ExpandIcon({
  isOpen,
  isFolder,
  name,
  isBeingUploaded,
}: {
  isOpen: boolean;
  isFolder: boolean;
  name: string;
  isBeingUploaded: boolean;
}) {
  const showIcon = isFolder && name !== "Content Block Files";
  const iconClass = classNames("h-4 w-4 ", showIcon ? "" : "opacity-0");
  const [uppyFile, setUppyFile] = useState<
    { file: UppyFile; progress: number } | undefined
  >(undefined);
  const { uploadingFiles } = useFileDrop();
  const [hasAlreadyStartedUpload, setHasAlreadyStartedUpload] = useState(false);

  const [key, setKey] = useState(cuid());
  useEffect(() => {
    const file = uploadingFiles.find((file) => file.file.name === name);
    if (!file) return setUppyFile(undefined);
    if (file.progress === 100) {
      setUppyFile(undefined);
      setKey(cuid());
      return;
    }
    setHasAlreadyStartedUpload(true);
    setUppyFile(file);
    setKey(cuid());
  }, [uploadingFiles]);

  const renderIcon = () => {
    switch (true) {
      case uppyFile !== undefined:
        return (
          <CircularProgress
            key={key}
            progress={Math.round(uppyFile?.progress || 0)}
            className="mr-0.5 size-[14px] text-transparent"
            textClassName="text-[0rem]"
            strokeWidth={8}
            finishedComponent={<></>}
            animateFrom={0}
          />
        );
      case !uppyFile && isBeingUploaded && !hasAlreadyStartedUpload:
        return (
          <div className="size-[14px] animate-spin rounded-full border-[1.2px] border-foreground border-t-primary"></div>
        );
      case isOpen:
        return <ChevronDownIcon className={iconClass} />;
      default:
        return <ChevronRightIcon className={iconClass} />;
    }
  };

  return renderIcon();
};
