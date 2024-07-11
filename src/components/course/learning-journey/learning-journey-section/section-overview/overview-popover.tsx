import { useTranslation } from "react-i18next";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import type { ContentBlock } from "@/src/types/course.types";

export const SectionOverviewPopover = ({
  block,
  children,
}: {
  block: ContentBlock;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation("page");

  const sectionProgress =
    learningJourneyHelper.calculateCompletedBlocksInSection(block, false) as {
      totalBlocks: number;
      completedBlocks: number;
    };

  return (
    <Popover>
      <PopoverTrigger className="h-full">{children}</PopoverTrigger>
      <PopoverContent className="z-[52]">
        <CardHeader className="p-0">
          <CardTitle>{block.name}</CardTitle>
          <CardDescription>{block.description}</CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-contrast">
              {t("section_popover.total_blocks")}
            </span>
            <span className="font-semibold text-contrast">
              {sectionProgress.totalBlocks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-contrast">
              {t("section_popover.completed_blocks")}
            </span>
            <span className="font-semibold text-positive">
              {sectionProgress.completedBlocks}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
