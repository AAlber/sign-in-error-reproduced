import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { toast } from "@/src/components/reusable/toaster/toast";
import useWorkbench, {
  WorkbenchType,
} from "@/src/components/workbench-deprecated/zustand";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "../content-block-user-table";

export default function UserTableUserTable({
  block,
}: {
  block: ContentBlock<"Assessment">;
}) {
  const { t } = useTranslation("page");
  const [opening, setOpening] = useState(false);
  const { openWorkbenchFromUserData } = useWorkbench.getState();

  const content = JSON.parse(block.specs.content);

  const columns: ColumnDef<ContentBlockUserStatus<"Assessment">>[] = [
    {
      id: "status",
      header: t("status"),
      cell: ({ row }) => (
        <>
          {row.original.status === "FINISHED" ||
          row.original.status === "REVIEWED" ? (
            <button
              onClick={async () => {
                setOpening(true);
                try {
                  const userStatus =
                    await contentBlockHandler.userStatus.getForUser<"Assessment">(
                      {
                        blockId: block.id,
                        userId: row.original.id,
                      },
                    );
                  openWorkbenchFromUserData({
                    content: JSON.parse(
                      userStatus.userData
                        ? userStatus.userData.content
                        : content,
                    ),
                    blockId: block.id,
                    workbenchType: WorkbenchType.ASSESSMENT,
                    user: {
                      id: row.original.id,
                      name: row.original.name,
                      image: row.original.image || undefined,
                    },
                  });
                } catch (error) {
                  toast.error("corrupted_file", {
                    description: "corrupted_file_description",
                  });
                }
                setOpening(false);
              }}
            >
              <span className="text-sm text-primary hover:opacity-80">
                {opening
                  ? t("general.loading")
                  : t(
                      "course_main_content_block_assessment.preview_content_open",
                    )}
              </span>
            </button>
          ) : (
            <p className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-contrast">
              {t(row.original.status)}
            </p>
          )}
        </>
      ),
    },
    {
      id: "review_added",
      header: t("review_added"),
      cell: ({ row }) => (
        <div className="text-muted-contrast">
          {t(row.original.status === "REVIEWED" ? "reviewed" : "not_reviewed")}
        </div>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      additionalColumns={columns}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"Assessment">(block.id)
      }
    />
  );
}
