import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { ContentBlock } from "@/src/types/course.types";
import { log } from "@/src/utils/logger/logger";
import { useBlockNewBadge } from "./zustand";

export const BlockNewBadge = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const { idsToDisplay, addToViewedIds } = useBlockNewBadge();
  const isNew = idsToDisplay.includes(block.id);

  if (!isNew) return null;

  return (
    <motion.div
      onViewportEnter={() => {
        log.info("Adding content block to viewed ids", { blockId: block.id });
        addToViewedIds(block.id);
      }}
      className="inline-flex animate-shimmer items-center justify-center rounded-full border border-primary/50 bg-[linear-gradient(110deg,hsl(var(--background)),45%,hsl(var(--accent)),55%,hsl(var(--background)))] bg-[length:200%_100%] px-2 py-0.5 text-xs text-contrast transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      {t("new")}
    </motion.div>
  );
};
