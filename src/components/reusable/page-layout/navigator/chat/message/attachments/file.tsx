/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { resolveFileType } from "friendly-mimes";
import { ChevronDown, FileText, Umbrella, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useMessageContext } from "stream-chat-react";
import classNames, {
  capitalize,
  createFile,
} from "@/src/client-functions/client-utils";
import useWhiteBoard from "@/src/components/reusable/page-layout/navigator/whiteboard/zustand";
import useNavigationOverlay, {
  type UploadObject,
} from "@/src/components/reusable/page-layout/navigator/zustand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { EnhancedFile } from "@/src/file-handlers";
import { enhanceFile } from "@/src/file-handlers";
import { OpenOrigin } from "@/src/file-handlers/zustand";

const FileAttachment = (props: {
  attachment: any;
  url: string;
  imgUrl: string;
}) => {
  const { url, imgUrl } = props;
  const attachment = props.attachment;

  const fileName = attachment.title;
  const truncatedName = fileName!.substring(0, 20);
  const extension = fileName!.split(".").pop();
  const displayFileName = `${truncatedName}...${extension}`;
  const whiteBoard = useWhiteBoard();

  const msgContext = useMessageContext();
  const isMyMessage = msgContext.isMyMessage();

  let fileDescription = "File";
  try {
    const fileType = resolveFileType(`.${extension}`);
    fileDescription = fileType.name;
  } catch (e) {}

  const { openCloudExport } = useNavigationOverlay();
  const title = attachment.title || "file-" + new Date();

  const [file, setFile] = useState<EnhancedFile | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  useEffect(() => {
    createFile(url || imgUrl, title, attachment.mime_type).then((file) => {
      setFile(
        enhanceFile({
          file: file,
          whiteBoard: whiteBoard,
          link: url,
          openOrigin: OpenOrigin.LobbyChat,
        }),
      );
      setFileToUpload(file);
    });
  }, []);

  const filename: string =
    attachment.title!.length > 20 ? displayFileName : attachment.title;

  if (!attachment) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={classNames(
          "flex h-16 min-w-16 items-center space-x-2 rounded-md border px-2 py-1 text-sm",
          isMyMessage
            ? "border-border bg-secondary"
            : "border-background/20 bg-background/40",
        )}
        onMouseUp={() => {
          // Seems to simulate doubleclick
          file?.open();
        }}
      >
        <div
          className={classNames(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            isMyMessage ? "bg-background/40" : "bg-muted",
          )}
        >
          <FileText className="h-7 w-7 text-muted-contrast" />
        </div>
        <div
          className={classNames(
            "flex space-x-3 divide-x",
            isMyMessage
              ? "divide-muted-contrast/50"
              : "divide-muted-contrast/40",
          )}
        >
          <div className="text-left">
            <p className="font-bold text-contrast">
              {capitalize(filename.toLowerCase())}
            </p>
            <p className="text-xs text-muted-contrast">{fileDescription}</p>
          </div>
          <ChevronDown
            className="pl-1 text-muted-contrast"
            size={18}
            aria-hidden="true"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="!min-w-fit">
        <DropdownMenuItem
          className="flex cursor-pointer items-center space-x-2 hover:bg-foreground"
          onClick={() => {
            openCloudExport({
              onSave: async () => {
                const objForUpload: UploadObject = {
                  name: title,
                  file: fileToUpload,
                  type: attachment.mime_type,
                };
                return Promise.resolve(objForUpload);
              },
            });
          }}
        >
          <UploadCloud className="text-muted-contrast" size={18} />
          <span>Save to Drive</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center space-x-2 hover:bg-foreground"
          onClick={() => {
            file?.open();
          }}
        >
          <Umbrella className="text-muted-contrast" size={18} />
          <span>Open</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileAttachment;
