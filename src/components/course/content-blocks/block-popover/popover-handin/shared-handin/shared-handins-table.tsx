import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import mime from "mime";
import { getFilenameFromUrl } from "pdfjs-dist";
import { useTranslation } from "react-i18next";
import { getDecodedFileNameFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  downloadFileFromUrl,
  truncate,
} from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import UserDefaultImage from "@/src/components/user-default-image";
import type { HandInSpecs } from "@/src/types/content-block/types/specs.types";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { GroupHandInButton } from "../group-handin";
import { useHandInDynamicPopover } from "../zustand";

export const SharedHandInsTable = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { handInUsers, setHandInUsers, loading, setLoading } =
    useHandInDynamicPopover();
  const isUploadedByPeer = handInUsers.some(
    (u) => u.id === user.id && u.userData?.uploadedByPeer,
  );

  const userHadUpload = handInUsers.some(
    (u) => u.id === user.id && u.userData?.url,
  );

  const blockType = block.specs as unknown as HandInSpecs;

  const columns: ColumnDef<ContentBlockUserStatus<"HandIn">>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {truncate(row.original.name, 30)}
        </div>
      ),
    },
    {
      id: "file",
      cell: ({ row }) => {
        const fileCanOpen = supportedFileTypesForFileViewer.includes(
          mime.getType(row.original.userData!.url)!,
        );

        return (
          <>
            {row.original.userData?.url ? (
              <div className="flex items-center justify-end gap-4">
                {fileCanOpen && (
                  <Button
                    variant={"link"}
                    onClick={() => {
                      if (row.original.userData?.url) {
                        downloadFileFromUrl(
                          decodeURIComponent(
                            getFilenameFromUrl(row.original.userData.url),
                          ),
                          row.original.userData.url,
                          true,
                        );
                      } else {
                        console.error("No file url");
                      }
                    }}
                    className="p-0"
                  >
                    {t("general.open")}
                  </Button>
                )}

                <Button
                  variant={"link"}
                  onClick={() => {
                    if (row.original.userData?.url) {
                      downloadFileFromUrl(
                        getDecodedFileNameFromUrl(row.original.userData.url),
                        row.original.userData!.url,
                      );
                    }
                  }}
                  className="p-0"
                >
                  {t("download")}
                </Button>
              </div>
            ) : (
              <p className="text-muted-contrast">
                {t(
                  "course_main_content_block_hand_in.preview_content_not_submitted",
                )}
              </p>
            )}
          </>
        );
      },
    },
  ];

  const notStarted = dayjs().isBefore(dayjs(block.startDate));
  const overDue = dayjs().isAfter(dayjs(block.dueDate));
  const canAccess = !notStarted && !overDue;

  return (
    <AsyncTable<ContentBlockUserStatus<"HandIn">>
      columns={columns}
      promise={() =>
        contentBlockHandler.userStatus.getForBlock<"HandIn">(
          block.id,
          true,
        ) as Promise<ContentBlockUserStatus<"HandIn">[]>
      }
      setData={(data) => {
        setHandInUsers(data);
        setLoading(false);
      }}
      data={handInUsers.filter((user) => user.userData?.url)}
      styleSettings={{
        additionalComponent: (
          <div className="relative flex flex-row-reverse gap-2">
            {!loading ? (
              <>
                {!isUploadedByPeer && (
                  <WithToolTip
                    disabled={canAccess}
                    text={t(notStarted ? "starts_on" : "ended_on", {
                      start: dayjs(block.startDate).format("DD MMM YYYY"),
                      end: dayjs(block.dueDate).format("DD MMM YYYY"),
                    })}
                  >
                    {/* <SharedHandinUploadPopover
                      block={block}
                      disabled={!canAccess}
                    >
                      <Button
                        disabled={!canAccess}
                        variant={"cta"}
                        className="relative"
                      >
                        {t("course_main_content_block_upload_title")}
                      </Button>
                    </SharedHandinUploadPopover> */}
                  </WithToolTip>
                )}
                {blockType.isGroupSubmission && !userHadUpload && (
                  <div>
                    <GroupHandInButton block={block} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-contrast">
                {t("general.loading")}
              </p>
            )}
          </div>
        ),
      }}
      refreshTrigger={block.id}
    />
  );
};
