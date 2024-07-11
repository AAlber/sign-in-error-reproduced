import { Download, Eye, X } from "lucide-react";
import mime from "mime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { getDecodedFileNameFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames, {
  downloadFileFromUrl,
  getLastItem,
} from "@/src/client-functions/client-utils";
import Box from "@/src/components/reusable/box";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import Spinner from "@/src/components/spinner";
import type { ContentBlock } from "@/src/types/course.types";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import useContentBlockOverview from "../block-overview/zustand";

type FilesPopoverProps = {
  block: ContentBlock;
  enableDeleteFile: boolean;
};

export function FilesBlockPopover({
  block,
  enableDeleteFile,
}: FilesPopoverProps) {
  const { t } = useTranslation("page");
  const [userStatus, setUserStatus] = useState<string>();
  const { setBlock } = useContentBlockOverview();
  const [isBeingDeleted, setIsBeingDeleted] = useState<string>();
  useEffect(() => {
    contentBlockHandler.userStatus
      .getForUser<"File">({ blockId: block.id })
      .then((status) => {
        setUserStatus(status.status);
      });
  }, [block.id]);

  async function updateUserStatus() {
    if (userStatus === "FINISHED") return;
    await contentBlockHandler.userStatus.update<"File">({
      blockId: block.id,
      data: {
        status: "IN_PROGRESS",
        userData: {
          downloadedAt: new Date(),
        },
      },
    });
  }

  async function downloadAndUpdateZustand(
    filename: string,
    dataUrl: string,
    openIfSupported?: boolean,
    secureMode?: boolean,
  ) {
    await downloadFileFromUrl(filename, dataUrl, openIfSupported, secureMode);
    await updateUserStatus();
  }

  async function deleteAndUpdateZustand(fileUrl: string) {
    setIsBeingDeleted(fileUrl);
    const newFiles = block.specs.files.filter((f) => f !== fileUrl);
    await deleteCloudflareDirectories([
      {
        url: fileUrl,
        isFolder: false,
      },
    ]);
    await contentBlockHandler.update.block<"File">({
      id: block.id,
      specs: {
        files: newFiles,
        isProtected: block.specs.isProtected,
      },
    });
    setBlock({
      ...block,
      specs: {
        ...block.specs,
        files: newFiles,
      },
    });
    setIsBeingDeleted(undefined);
  }

  return (
    <Box smallPadding className="max-h-[300px] !overflow-y-auto">
      {block.specs.files.map((fileUrl) => {
        const isLastFile = getLastItem(block.specs.files) === fileUrl;
        const fileName = fileUrl
          ? getDecodedFileNameFromUrl(fileUrl)
          : t("file_upload_failed");
        return (
          <div
            key={fileUrl}
            className={classNames(
              isLastFile ? "" : "mb-2",
              "flex items-center justify-between",
            )}
          >
            <div className="text-left text-sm">
              <TruncateHover
                truncateAt={enableDeleteFile ? 18 : 23}
                text={fileName}
              />
            </div>
            {isBeingDeleted === fileUrl && <Spinner size="h-4 w-4" />}
            {isBeingDeleted !== fileUrl && (
              <div className="flex gap-2">
                {!block.specs.isProtected && (
                  <Button
                    variant={"ghost"}
                    onClick={async () => {
                      await downloadAndUpdateZustand(
                        fileName,
                        fileUrl,
                        false,
                        block.specs.isProtected,
                      );
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {supportedFileTypesForFileViewer.includes(
                  mime.getType(fileName) || "not",
                ) && (
                  <Button
                    variant={"ghost"}
                    onClick={async () => {
                      await downloadAndUpdateZustand(
                        fileName,
                        fileUrl,
                        true,
                        block.specs.isProtected,
                      );
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {enableDeleteFile && block.specs.files.length > 1 && (
                  <Button
                    variant={"ghost"}
                    onClick={async () => {
                      await deleteAndUpdateZustand(fileUrl);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </Box>
  );
}
