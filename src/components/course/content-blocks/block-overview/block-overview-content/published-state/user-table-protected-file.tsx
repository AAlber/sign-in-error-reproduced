import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableProtectedFile({
  block,
}: {
  block: ContentBlock<"ProtectedFile">;
}) {
  const { t } = useTranslation("page");

  const columns: ColumnDef<ContentBlockUserStatus<"ProtectedFile">>[] = [
    {
      id: "viewed",
      header: t("viewed"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {row.original.status !== "FINISHED"
            ? t("not_viewed")
            : row.original.userData
            ? replaceVariablesInString(t("viewed_at"), [
                dayjs(row.original.userData.viewedAt).format("DD MMM YYYY"),
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
        contentBlockHandler.userStatus.getForBlock<"ProtectedFile">(
          block.id,
          true,
        )
      }
      additionalColumns={columns}
    />
  );
}
