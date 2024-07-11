import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import useCourse from "../zustand";
import { LearningJourneyItem } from "./learning-journey-item/learning-item";

type Props = {
  loading: boolean;
};

export function LearningJourneyLoadingGrid({ loading }: Props) {
  const course = useCourse((state) => state.course);
  const hasSpecialRole = useCourse((state) => state.hasSpecialRole);
  const isTestingMode = useCourse((state) => state.isTestingMode);
  const isStudent = !(hasSpecialRole || isTestingMode);

  const blocksToRenderCount = isStudent
    ? course.publishedContentBlockCount
    : course.totalContentBlockCount;

  if (!loading) return null;
  return (
    <>
      {Array.from({
        length: blocksToRenderCount!,
      }).map((_, index) => {
        const fakePositions = learningJourneyHelper.getBlockPositions(
          blocksToRenderCount ?? 0,
        );
        return (
          <LearningJourneyItem
            align={fakePositions[index]!}
            loading={true}
            block={null}
            userStatusLoading={true}
            state="locked"
            key={index}
          />
        );
      })}
    </>
  );
}
