import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import courseGoalHandler from "@/src/client-functions/client-course-goals";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";

export default function GoalContentSelector({
  layerId,
  alreadySelectedBlocks,
  updateSelectedBlocks,
}) {
  const { t } = useTranslation("page");

  const handleSelect = async (block: ContentBlock) => {
    updateSelectedBlocks([...alreadySelectedBlocks, block]);
    const result = await courseGoalHandler.update.goal({
      layerId: block.layerId,
      contentBlockId: block.id,
    });

    if (!result.success) {
      updateSelectedBlocks(
        alreadySelectedBlocks.filter((b) => b.id !== block.id),
      );
    }
  };

  return (
    <AsyncSelect
      trigger={<Button variant={"cta"}>{t("add")}</Button>}
      openWithShortcut
      placeholder="course_switcher.search"
      noDataMessage="course_switcher.no_courses"
      fetchData={() => contentBlockHandler.get.allBlocksOfLayer(layerId)}
      onSelect={handleSelect}
      filter={(block) => !alreadySelectedBlocks.find((b) => b.id === block.id)}
      searchValue={(block) => `${block.name} ${block.id}`}
      itemComponent={(block) => {
        const blockStyle = contentBlockHandler.get.registeredContentBlockByType(
          block.type,
        ).style;

        return (
          <div className="flex w-full items-center gap-2">
            <span>{blockStyle.icon}</span>
            <span>{truncate(block.name, 30)}</span>
          </div>
        );
      }}
    />
  );
}
