import type { ColumnDef } from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableAudio({
  block,
}: {
  block: ContentBlock<"Audio">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"Audio">>[] = [
    {
      id: "listened",
      header: t("listened"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {row.original.userData && row.original.userData.lastListenedAt ? (
            <span>
              {replaceVariablesInString(t("last_listened_at_x"), [
                dayjs(row.original.userData.lastListenedAt).format(
                  "DD.MM.YYYY HH:mm",
                ),
              ])}
            </span>
          ) : (
            <span>{t("audio_not_listened")}</span>
          )}
        </p>
      ),
    },
    {
      id: "progress",
      header: t("progress"),
      cell: ({ row }) => {
        const listenedPercentage =
          row.original.userData?.listenedPercentage ?? 0;

        return (
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            {listenedPercentage > 0 && (
              <div
                style={{
                  width: `${listenedPercentage}%`,
                }}
                className={cx(
                  "h-full rounded-full",
                  listenedPercentage === 100 ? "bg-positive" : "bg-primary",
                )}
              />
            )}
          </div>
        );
      },
    },
  ];
  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"Audio">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
