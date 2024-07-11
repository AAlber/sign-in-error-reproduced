import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../../content-block-user-table";
import { UserTableExternalDeliverableSelect } from "./finish-select";

export const UserTableExternalDeliverable = ({
  block,
}: {
  block: ContentBlock;
}) => {
  const { t } = useTranslation("page");

  const isUserStudentCanMarkAsFinished = block.specs.studentCanMarkAsFinished;

  const columns: ColumnDef<ContentBlockUserStatus<"ExternalDeliverable">>[] = [
    {
      id: "markedAsFinished",
      header: t("content_block.external_content.marked_as_finished"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {!isUserStudentCanMarkAsFinished ? (
            <UserTableExternalDeliverableSelect block={block} row={row} />
          ) : (
            <>
              {row.original.userData &&
              row.original.userData.markedAsFinishedDate ? (
                <p>
                  {t("content_block.external_content.finished_at", {
                    date: dayjs(
                      row.original.userData.markedAsFinishedDate,
                    ).format("DD MMMM YYYY - HH:mm"),
                  })}
                </p>
              ) : (
                <p>
                  {t("content_block.external_content.mark_as_not_finished")}
                </p>
              )}
            </>
          )}
        </p>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"ExternalDeliverable">(
          block.id,
          true,
        )
      }
      additionalColumns={columns}
    />
  );
};
