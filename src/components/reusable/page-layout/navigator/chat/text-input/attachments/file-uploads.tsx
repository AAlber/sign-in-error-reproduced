import { resolveFileType } from "friendly-mimes";
import { FileText } from "lucide-react";
import React, { useMemo } from "react";
import {
  useChannelStateContext,
  useMessageInputContext,
} from "stream-chat-react";
import classNames from "@/src/client-functions/client-utils";
import CancelButton from "./cancel-button";
import CustomLoader from "./loader";

const FileUploads = () => {
  const { fileUploads, removeFile } = useMessageInputContext();
  const ctx = useChannelStateContext();

  const files = useMemo(() => {
    return Object.values(fileUploads ?? {}).map((files) => files);
  }, [fileUploads]);

  const handleRemoveFile = (url: string, id: string) => () => {
    ctx.channel
      .deleteFile(url)
      .then(() => {
        removeFile(id);
      })
      .catch(console.log);
  };

  if (!files.length) return null;
  return (
    <>
      {files.map((i) => {
        const url = i.url || i.thumb_url || i.file.uri || "";
        const extension = i.file.name.match(/^.+(\.[a-zA-Z]*)$/)?.[1] ?? "";
        let fileDescription = "File";

        try {
          // try-catch here as this lib throws if fileType not found
          const fileType = resolveFileType(extension);
          fileDescription = fileType.name;
        } catch (e) {}

        return (
          <div
            className="group relative flex h-16 min-w-16 cursor-pointer items-center rounded-md border border-border bg-background px-2 opacity-80 transition-opacity hover:opacity-100"
            key={i.id}
          >
            <CancelButton onClick={handleRemoveFile(url, i.id)} />
            <div
              className={classNames(
                "relative flex space-x-2",
                i.state === "uploading" && "opacity-50",
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-7 w-7 text-muted-contrast" />
              </div>
              <div>
                <p className="text-sm font-bold leading-6 text-contrast">
                  {i.file.name}
                </p>
                <p className="text-xs text-muted-contrast">{fileDescription}</p>
              </div>
              {i.state === "uploading" && (
                <div className="absolute inset-0">
                  <CustomLoader className="!opacity-100" key={i.id} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default React.memo(FileUploads);
