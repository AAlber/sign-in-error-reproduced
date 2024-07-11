import type { ColumnDef } from "@tanstack/react-table";
import { Blocks } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import courseGoalHandler from "@/src/client-functions/client-course-goals";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state";
import type { ContentBlock } from "@/src/types/course.types";
import SettingsSection from "../../../reusable/settings/settings-section";
import CourseManagementGoalContentMenu from "./goal-content-menu";
import GoalContentSelector from "./goal-content-selector";

type Props = {
  layerId: string;
};

export default function GoalContent({ layerId }: Props) {
  const { t } = useTranslation("page");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // TODO: fix duplicate request
  async function fetchContentBlockRequirements() {
    const result = await courseGoalHandler.get.courseGoals(layerId);
    const blocks = (result?.blockGoals as ContentBlock[]) ?? [];
    setContentBlocks(blocks);
    return blocks;
  }

  const columns: ColumnDef<ContentBlock>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        const blockType = contentBlockHandler.get.registeredContentBlockByType(
          row.original.type,
        );
        return (
          <p className="flex w-full items-center gap-2">
            <span>{blockType.style.icon}</span>
            <span> {truncate(row.original.name, 30)}</span>
          </p>
        );
      },
    },
    {
      id: "menu",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <CourseManagementGoalContentMenu
            layerId={layerId}
            block={row.original}
            alreadySelectedBlocks={contentBlocks}
            updateSelectedBlocks={setContentBlocks}
          />
        </div>
      ),
    },
  ];

  return (
    <SettingsSection
      title="course_management.goals.prerequisites"
      subtitle="course_management.goals.prerequisites.description"
      noFooter
    >
      <AsyncTable<ContentBlock>
        promise={fetchContentBlockRequirements}
        data={contentBlocks}
        setData={setContentBlocks}
        columns={columns}
        refreshTrigger={layerId}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={Blocks}
              title="course.prerequisites.empty"
              description="course.prerequisites.empty.description"
            >
              <EmptyState.Article articleId={9182758} />
            </EmptyState>
          ),
          rowsPerPage: 5,
          additionalComponent: (
            <GoalContentSelector
              layerId={layerId}
              alreadySelectedBlocks={contentBlocks}
              updateSelectedBlocks={setContentBlocks}
            />
          ),
        }}
      />
    </SettingsSection>
  );
}
