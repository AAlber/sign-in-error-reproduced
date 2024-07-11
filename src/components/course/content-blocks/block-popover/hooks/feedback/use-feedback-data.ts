import type { CourseContentBlockFeedback } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContentBlockFeedback } from "@/src/client-functions/client-contentblock/utils";
import useCourse from "../../../../zustand";

export const useFeedbackData = (blockId: string) => {
  const { course } = useCourse();
  const queryClient = useQueryClient();
  const queryKey = [`content-block-${blockId}-feedback`];
  const cachedFeedback =
    queryClient.getQueryData<CourseContentBlockFeedback>(queryKey);

  const feedback = useQuery({
    queryKey,
    enabled: !cachedFeedback,
    queryFn: () =>
      getContentBlockFeedback<CourseContentBlockFeedback>({
        layerId: course?.layer_id ?? "",
        blockId,
      }),
  });

  return { feedback, queryKey };
};
