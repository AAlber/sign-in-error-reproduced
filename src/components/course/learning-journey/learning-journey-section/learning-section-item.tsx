import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { ContentBlock } from "@/src/types/course.types";
import { useSectionOverview } from "./section-overview/zustand";
import { SectionDaySpanDate } from "./section-span-date";

export const LearningSectionItem = ({
  children,
  block,
  loading,
}: {
  children?: React.ReactNode;
  block: ContentBlock;
  loading: boolean;
}) => {
  const { setSectionsWhoAreInView } = useSectionOverview();

  const addSectionToView = () => {
    setSectionsWhoAreInView([block]);
  };

  const removeSectionFromView = () => {
    setSectionsWhoAreInView([block], true);
  };

  return (
    <motion.div
      className="relative flex h-auto w-full flex-col items-center"
      onViewportEnter={() => {
        addSectionToView();
      }}
      onViewportLeave={() => {
        removeSectionFromView();
      }}
    >
      <div className="relative h-auto w-full">
        <div className="relative flex w-full flex-col items-center justify-center py-4">
          <div className="flex w-full items-center gap-4 px-8">
            <p className="w-full text-center text-2xl font-medium text-contrast">
              {block.name}
              {block.description && (
                <WithToolTip text={block.description}>
                  <Button variant={"ghost"} size={"iconSm"} className={"ml-1"}>
                    <HelpCircle className="size-3.5 text-muted-contrast" />
                  </Button>
                </WithToolTip>
              )}
            </p>
          </div>
          <SectionDaySpanDate block={block} />
        </div>
      </div>
      {children}
    </motion.div>
  );
};
