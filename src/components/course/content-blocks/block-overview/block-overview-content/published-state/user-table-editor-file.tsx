import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableEditorFile({
  block,
}: {
  block: ContentBlock<"EditorFile">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"EditorFile">>[] = [
    {
      id: "viewed",
      header: t("viewed"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {!row.original.userData?.lastViewedAt
            ? t("not_viewed")
            : row.original.userData?.lastViewedAt
            ? replaceVariablesInString(t("viewed_at"), [
                dayjs(row.original.userData.lastViewedAt).format("DD MMM YYYY"),
              ])
            : t("viewed")}
        </p>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"EditorFile">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
