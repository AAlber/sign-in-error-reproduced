import { AnimatePresence, motion } from "framer-motion";
import { Book } from "lucide-react";
import useScrollVisibility from "../../hooks/use-scroll-visibility";
import useSectionOverviewVisibility from "../../hooks/use-section-overview-visibility";
import { SectionOverviewPopover } from "./overview-popover";

export const SectionOverview = ({ contentBlocks }) => {
  const isVisible = useScrollVisibility("scroll-section");
  const {
    showSectionOverview,
    hideSectionOverview,
    sectionsWhoAreInView,
    completePercentage,
  } = useSectionOverviewVisibility(contentBlocks, isVisible);

  if (!showSectionOverview || !sectionsWhoAreInView[0]) return null;

  return (
    <AnimatePresence>
      {showSectionOverview && !hideSectionOverview && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-20 z-50 mx-4 flex h-16 w-1/4 items-center rounded-md border border-border bg-popover milkblur-light"
        >
          <div className="flex size-full items-center justify-between pl-2">
            <div className="flex w-full flex-col items-start gap-2 pr-2">
              <h1 className="text-sm font-medium">
                {sectionsWhoAreInView[0].name}
              </h1>
              <div className="relative h-1.5 w-3/4 overflow-hidden rounded-full bg-border">
                <div
                  className="absolute left-0 top-0 h-full bg-primary"
                  style={{
                    width: `${completePercentage}%`,
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
            </div>
            <SectionOverviewPopover block={sectionsWhoAreInView[0]}>
              <div className="flex h-full w-auto items-center border-l border-border px-4 text-muted-contrast">
                <Book size={18} />
              </div>
            </SectionOverviewPopover>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
