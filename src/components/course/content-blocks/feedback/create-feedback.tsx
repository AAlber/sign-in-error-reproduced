import type { CourseContentBlockFeedback } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { getContentBlockFeedback } from "@/src/client-functions/client-contentblock/utils";
import useCourse from "@/src/components/course/zustand";
import Stars from "./stars";

type Props = {
  blockId: string;
};

export default function CreateContentBlockFeedback({ blockId }: Props) {
  const { course } = useCourse();
  const { t } = useTranslation("page");

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

  const { mutateAsync } = useMutation({
    mutationKey: queryKey,
    mutationFn: contentBlockHandler.create.feedback,
    /**
     * Optimistic update:
     * https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
     */
    onMutate: async (block) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, () => block);
      return { prev };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(queryKey, context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleClick = async (rating: number) => {
    await mutateAsync({
      blockId,
      layerId: course?.layer_id ?? "",
      rating,
      text: null,
    });
  };

  const score =
    typeof feedback.data?.rating === "undefined" ? 0 : feedback.data.rating + 1;

  return (
    <div className="flex h-8 items-center justify-between space-y-1 rounded-md border border-border p-2 text-sm">
      <p>{t("course_main_content_feedbacks_rate_task")}</p>
      <Stars score={score} onClick={handleClick} />
    </div>
  );
}
