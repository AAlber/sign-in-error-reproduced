import type { ContentBlockUserGrading } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import UserDefaultImage from "@/src/components/user-default-image";
import type {
  ContentBlockUserDataMapping,
  ContentBlockUserStatus,
} from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { log } from "@/src/utils/logger/logger";
import { BlockRatingPopover } from "../block-rating-popover";
import useContentBlockOverview from "../zustand";
import { FilesEditor } from "./draft-state/files-editor";

type ContentBlockUserTableProps<
  T extends keyof ContentBlockUserDataMapping | undefined,
> = {
  block: ContentBlock;
  fetchData: () => Promise<ContentBlockUserStatus<T>[]>;
  additionalColumns?: ColumnDef<ContentBlockUserStatus<T>>[];
  showOpenButton?: boolean;
};

export default function ContentBlockUserTable<
  T extends keyof ContentBlockUserDataMapping | undefined,
>({
  block,
  fetchData,
  additionalColumns = [],
  showOpenButton = true,
}: ContentBlockUserTableProps<T>) {
  const { t } = useTranslation("page");
  const { refresh, setOpen, refreshOverview } = useContentBlockOverview();
  const [gradingUserStatuses, setGradingUserStatuses] = useState<
    ContentBlockUserStatus[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [shareResultsLoading, setShareResultsLoading] = useState(false);

  const handleSubmittedGrade = (
    userId: string,
    userGrading: ContentBlockUserGrading,
  ) => {
    setGradingUserStatuses(
      gradingUserStatuses.map((userStatus) =>
        userStatus.id === userId
          ? { ...userStatus, rating: userGrading }
          : userStatus,
      ),
    );
  };

  const baseColumns: ColumnDef<ContentBlockUserStatus<T>>[] = [
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
      id: "rating",
      header: () => (
        <div className="flex w-full  items-center justify-end">
          {t("rating")}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-end gap-2">
          <BlockRatingPopover
            onGraded={handleSubmittedGrade}
            rowUser={row.original}
            block={block}
          />
        </div>
      ),
    },
  ];

  const columns = [baseColumns[0]!, ...additionalColumns, baseColumns[1]!];

  const gradingsWithGrade = gradingUserStatuses.filter((g) => g.rating);
  const hasUngradedGradings = gradingUserStatuses.some((g) => !g.rating);

  const allGradingsShared = gradingsWithGrade.every(
    (d) => d.status === "REVIEWED",
  );

  const handleShareResults = async (fromModal = false) => {
    log.click("Clicked Share Results button");
    async function shareResults() {
      // Sharing results is done by
      // changing the content block user's status
      // to "REVIEWED"
      setShareResultsLoading(true);
      return await contentBlockHandler.userStatus.updateMultiple({
        blockId: block.id,
        userIds: gradingsWithGrade.map((g) => g.id), // only update status of users who have been graded
        data: {
          status: "REVIEWED",
          userData: gradingUserStatuses.map((g) => g.userData),
        },
      });
    }

    if (hasUngradedGradings && !fromModal) {
      confirmAction(
        async () => {
          await shareResults();
          refreshOverview();
        },
        {
          title: t("course_main_content_block_confirm_publish_grades_title"),
          description: t("course_main_content_block_confirm_publish_grades"),
          actionName: t("general.confirm"),
        },
      );
    } else {
      await shareResults();
      refreshOverview();
    }
  };

  const handleSetData = (data: ContentBlockUserStatus[]) => {
    setShareResultsLoading(false);
    setGradingUserStatuses(data);
  };

  return (
    <>
      <AsyncTable
        promise={fetchData}
        data={gradingUserStatuses}
        setData={handleSetData}
        columns={columns}
        refreshTrigger={refresh}
        styleSettings={{
          additionalComponent: (
            <div className="flex gap-2">
              {showOpenButton ? (
                block.type === "File" ? (
                  <FilesEditor block={block}>
                    <Button>
                      {t(
                        "course_main_content_block_learning_preview_view_material",
                      )}
                    </Button>
                  </FilesEditor>
                ) : (
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      setOpen(false);
                      await contentBlockHandler.zustand.open(block.id);
                      setLoading(false);
                    }}
                  >
                    {loading
                      ? t("general.loading")
                      : t(
                          "course_main_content_block_learning_preview_view_material",
                        )}
                  </Button>
                )
              ) : null}
              {!allGradingsShared && (
                <Button
                  disabled={shareResultsLoading}
                  onClick={async () => {
                    await handleShareResults();
                  }}
                  variant="cta"
                >
                  {shareResultsLoading
                    ? t("general.loading")
                    : t(
                        "course_main_content_block_learning_preview_share_results",
                      )}
                </Button>
              )}
            </div>
          ),
        }}
      />
    </>
  );
}
