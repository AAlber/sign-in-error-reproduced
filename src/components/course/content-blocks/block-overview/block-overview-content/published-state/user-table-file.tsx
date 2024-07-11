import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableFile({
  block,
}: {
  block: ContentBlock<"File">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"File">>[] = [
    {
      id: "viewed",
      header: t("viewed"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {!row.original.userData?.downloadedAt
            ? t("not_downloaded")
            : row.original.userData?.downloadedAt
            ? replaceVariablesInString(t("downloaded_at"), [
                dayjs(row.original.userData.downloadedAt).format("DD MMM YYYY"),
              ])
            : t("downloaded")}
        </p>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"File">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
