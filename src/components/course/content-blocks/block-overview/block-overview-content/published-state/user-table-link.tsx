import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export const UserTableLink = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"Link">>[] = [
    {
      id: "lastViewed",
      header: t("last-viewed"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {row.original.userData && row.original.userData.lastViewed ? (
            <span>
              {dayjs(row.original.userData.lastViewed).format(
                "DD MMMM YYYY / HH:mm",
              )}
            </span>
          ) : (
            <span>{t("not_viewed")}</span>
          )}
        </p>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"Link">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
};
