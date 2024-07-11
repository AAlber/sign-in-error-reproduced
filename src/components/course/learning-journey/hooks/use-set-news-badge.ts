import { useEffect } from "react";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../zustand";
import { useBlockNewBadge } from "../learning-journey-item/new-badge/zustand";

const useSetNewContentBlocks = (
  contentBlocks: ContentBlock[],
  isReady: boolean,
) => {
  const { page } = useCourse();
  const viwedIds = useBlockNewBadge((state) => state.viwedIds);
  const setIdsToDisplay = useBlockNewBadge((state) => state.setIdsToDisplay);

  useEffect(() => {
    if (isReady) {
      const newContentBlocks =
        learningJourneyHelper.getNewContentBlocks(contentBlocks);
      const newIds = newContentBlocks
        .filter(
          (block) =>
            (block.userStatus === "NOT_STARTED" ||
              block.userStatus === "LOCKED") &&
            block.type !== "Section" &&
            block.status === "PUBLISHED" &&
            !viwedIds.includes(block.id),
        )
        .map((block) => block.id);

      // Add condition to check if newIds are different before updating state
      if (newIds.length > 0 && newIds.some((id) => !viwedIds.includes(id))) {
        console.log("newIds", newIds);
        setIdsToDisplay(newIds);
      }
    }
  }, [contentBlocks, isReady, viwedIds]);

  useEffect(() => {
    //remove the ids to display when the pages changes
    setIdsToDisplay([]);
  }, [page]);
};

export default useSetNewContentBlocks;
