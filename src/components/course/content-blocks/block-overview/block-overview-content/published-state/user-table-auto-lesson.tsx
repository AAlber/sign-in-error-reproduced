import type { ColumnDef } from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableAutoLesson({
  block,
}: {
  block: ContentBlock<"AutoLesson">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"AutoLesson">>[] = [
    {
      id: "status",
      header: t("status"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {t(row.original.status)}
        </p>
      ),
    },
    {
      id: "progress",
      header: t("progress"),
      cell: ({ row }) => {
        const chapters = row.original.userData?.chapters;
        const finishedChapters = chapters?.filter((c) => c.finished);

        const percentage = Math.round(
          ((finishedChapters?.length || 0) / (chapters?.length || 1)) * 100,
        );
        return (
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            {row.original.userData &&
              row.original.userData.chapters.length > 0 && (
                <div
                  style={{
                    width: `${percentage}%`,
                  }}
                  className={cx(
                    "h-full rounded-full",
                    percentage === 100 ? "bg-positive" : "bg-primary",
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
        contentBlockHandler.userStatus.getForBlock<"AutoLesson">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
