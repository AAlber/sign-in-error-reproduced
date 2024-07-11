import type { ColumnDef } from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableVideo({
  block,
}: {
  block: ContentBlock<"Video">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"Video">>[] = [
    {
      id: "viewed",
      header: t("viewed"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {row.original.userData && row.original.userData.lastWatchedAt ? (
            <span>
              {replaceVariablesInString(t("last_watched_at_x"), [
                dayjs(row.original.userData.lastWatchedAt).format(
                  "DD.MM.YYYY HH:mm",
                ),
              ])}
            </span>
          ) : (
            <span>{t("not_watched")}</span>
          )}
        </p>
      ),
    },
    {
      id: "progress",
      header: t("progress"),
      cell: ({ row }) => (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          {row.original.userData &&
            row.original.userData.watchedPercentage > 0 && (
              <div
                style={{ width: `${row.original.userData.watchedPercentage}%` }}
                className={cx(
                  "h-full rounded-full",
                  row.original.userData.watchedPercentage === 100
                    ? "bg-positive"
                    : "bg-primary",
                )}
              />
            )}
        </div>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"Video">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
