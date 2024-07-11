import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import useCourse from "../../zustand";
import useFetchUserStatus from "./use-fetch-user-status";

export function useLearningJourneyContent() {
  const hasSpecialRole = useCourse((state) => state.hasSpecialRole);
  const isTestingMode = useCourse((state) => state.isTestingMode);

  const { loadingUserStatus } = useFetchUserStatus();
  const shouldFilterBlocks = !(hasSpecialRole || isTestingMode);

  const contentBlocks =
    learningJourneyHelper.getContentBlocks(shouldFilterBlocks);

  const positions = learningJourneyHelper.getBlockPositions(
    contentBlocks.length,
  );
  const blocksIdsInsideSections =
    learningJourneyHelper.getBlockIdsInsideSections(contentBlocks);

  return {
    contentBlocks,
    positions,
    blocksIdsInsideSections,
    loadingUserStatus,
  };
}
