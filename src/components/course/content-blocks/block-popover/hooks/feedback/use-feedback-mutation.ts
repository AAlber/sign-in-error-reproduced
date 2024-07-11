import { useMutation, useQueryClient } from "@tanstack/react-query";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";

export const useFeedbackMutation = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: mutateLoading } = useMutation({
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

  return { mutateAsync, isLoading: mutateLoading };
};
