import { motion } from "framer-motion";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlock } from "@/src/types/course.types";
import type {
  LearningJourneyAlignment,
  LearningJourneyState,
} from "@/src/types/learning-journey.types";
import { useSectionOverview } from "../learning-journey-section/section-overview/zustand";
import { LearningJourneyItem } from "./learning-item";

export const LearningComponent = ({
  block,
  align,
  state,
  loading,
  loadingUserStatus,
  isBlockBeforeSection,
  isLastBlockBeforeSection,
}: {
  block: ContentBlock;
  align: LearningJourneyAlignment;
  state: LearningJourneyState;
  loading: boolean;
  loadingUserStatus: boolean;
  isBlockBeforeSection: boolean;
  isLastBlockBeforeSection: boolean;
}) => {
  const { setHideSectionOverview } = useSectionOverview();
  const type = contentBlockHandler.get.registeredContentBlockByType(block.type);
  const icon = type.style.icon;
  return (
    <motion.div
      onViewportEnter={() => {
        if (isBlockBeforeSection) {
          setHideSectionOverview(true);
        }
      }}
      onViewportLeave={() => {
        if (isLastBlockBeforeSection) {
          setHideSectionOverview(false);
        }
      }}
    >
      <LearningJourneyItem
        key={block.id}
        align={align}
        state={state}
        block={block}
        loading={loading}
        userStatusLoading={loadingUserStatus}
      >
        {icon}
      </LearningJourneyItem>
    </motion.div>
  );
};
