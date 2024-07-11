import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Download, Eye } from "lucide-react";
import mime from "mime";
import { useTranslation } from "react-i18next";
import { getDecodedFileNameFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import ContentBlockUserTable from "../../content-block-user-table";
import CommentPopover from "./comment-popover";

export default function UserTableHandIn({
  block,
}: {
  block: ContentBlock<"HandIn">;
}) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { t } = useTranslation("page");

  function extractFilenameFromUrl(url: string): string {
    const fileName = url
      ? getDecodedFileNameFromUrl(url)
      : t("file_upload_failed");
    return fileName;
  }

  const columns: ColumnDef<ContentBlockUserStatus<"HandIn">>[] = [
    {
      id: "file",
      header: t("file"),
      cell: ({ row }) => (
        <>
          {row.original.userData &&
          (row.original.userData.url ||
            row.original.userData.uploadedByPeer) ? (
            <>
              {row.original.userData.uploadedByPeer && (
                <TruncateHover
                  text={
                    t("submitted_by") +
                    " " +
                    row.original.userData.uploadedByPeer
                  }
                  truncateAt={25}
                />
              )}
              <div className="flex items-center gap-2">
                {row.original.userData.url && (
                  <Button
                    size={"small"}
                    variant={"ghost"}
                    className="pl-0 font-normal text-primary underline"
                    onClick={() => {
                      if (!row.original.userData) return;
                      const filename = extractFilenameFromUrl(
                        row.original.userData.url,
                      );

                      downloadFileFromUrl(
                        filename,
                        row.original.userData.url,
                        false,
                      );
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                {row.original.userData?.url &&
                  supportedFileTypesForFileViewer.includes(
                    mime.getType(row.original.userData?.url) ?? "not",
                  ) && (
                    <Button
                      size={"small"}
                      variant={"ghost"}
                      className="pl-0 font-normal text-primary underline"
                      onClick={async () => {
                        if (row.original.userData?.url) {
                          const filename = extractFilenameFromUrl(
                            row.original.userData.url,
                          );

                          downloadFileFromUrl(
                            filename,
                            row.original.userData.url,
                            true,
                          );
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
              </div>
            </>
          ) : (
            <span className="text-muted-contrast">
              {t(
                "course_main_content_block_hand_in.preview_content_not_submitted",
              )}{" "}
            </span>
          )}
        </>
      ),
    },
    {
      id: "uploaded-at",
      header: t("uploaded-at"),
      cell: ({ row }) => (
        <div>
          <p className="whitespace-nowrap text-muted-contrast">
            {row.original.userData && row.original.userData.uploadedAt ? (
              <>
                {dayjs(row.original.userData.uploadedAt).format(
                  "DD. MMM YYYY HH:mm",
                )}
              </>
            ) : (
              t("no_data")
            )}
          </p>
        </div>
      ),
    },
    {
      id: "comment",
      header: t("comment"),
      cell: ({ row }) => (
        <>
          {row.original.userData && row.original.userData.comment ? (
            <CommentPopover comment={row.original.userData?.comment || ""}>
              <Button
                variant={"link"}
                className="flex w-full justify-center pl-0"
              >
                <p>
                  {t("course_main_content_block_hand_in.comment_available")}
                </p>
              </Button>
            </CommentPopover>
          ) : (
            <p className="text-muted-contrast">
              {t("course_main_content_block_hand_in.no_comment")}
            </p>
          )}
        </>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"HandIn">(block.id, true)
      }
      additionalColumns={columns}
      showOpenButton={false}
    />
  );
}
