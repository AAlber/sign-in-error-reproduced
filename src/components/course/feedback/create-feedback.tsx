import type { CourseFeedback, FeedbackRatingEnum } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createFeedback,
  getFeedback,
} from "@/src/client-functions/client-course";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { toast } from "@/src/components/reusable/toaster/toast";
import { Button } from "../../reusable/shadcn-ui/button";
import useCourse from "../zustand";
import { emojis, type Rating } from "./emoji-score";

type FeedbackField = {
  feedback: string;
};

const CreateFeedback = () => {
  const { course } = useCourse();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("page");

  const queryClient = useQueryClient();
  const queryKey = [`course-${course?.layer_id}-feedback`];
  const cachedFeedback = queryClient.getQueryData<CourseFeedback>(queryKey);

  const [selectedEmoji, setSelectedEmoji] = useState<Rating | undefined>(
    !!cachedFeedback ? matchEmoji(cachedFeedback?.score) : undefined,
  );

  const { control, watch, handleSubmit, formState, reset } =
    useForm<FeedbackField>({
      defaultValues: {
        feedback: cachedFeedback?.text ?? "",
      },
    });

  function matchEmoji(score: FeedbackRatingEnum) {
    return emojis.find((em) => score === em.score);
  }

  useQuery({
    queryFn: () => getFeedback(course?.layer_id ?? ""),
    queryKey,
    enabled: isOpen,
    staleTime: Infinity,
    onSuccess(data) {
      if (Array.isArray(data)) return;
      if (!data) return;
      setSelectedEmoji(matchEmoji(data.score));
      reset({ feedback: data?.text });
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createFeedback,
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey });
      setIsOpen(false);
      toast.success("toast.feedback_success_sent", {
        description: "toast.feedback_success_sent_description",
      });
    },
  });

  const FEEDBACK_MAX_LENGTH = 500;
  const feedbackValue = watch("feedback");

  const handleCreateReview = async (value: FeedbackField) => {
    if (!selectedEmoji) return;
    await mutateAsync({
      layerId: course?.layer_id ?? "",
      text: value.feedback,
      score: selectedEmoji.score,
    });
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
      }}
    >
      <PopoverTrigger className="w-full">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <Star className="mr-2 h-4 w-4 text-primary " />
          {t("course_header_button_feedback")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="mr-1 w-auto p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full flex-col gap-2 text-sm text-contrast">
          <div className="flex items-end justify-between px-3 ">
            <h1 className="pt-2">{t("course_header_feedback_title")}</h1>
            <span className="text-xs text-muted-contrast">
              {feedbackValue.length}/500
            </span>
          </div>
          <div className="px-2">
            <Controller
              control={control}
              name="feedback"
              render={({ field, fieldState }) => {
                return (
                  <>
                    <span className="break-words text-xs text-destructive">
                      {fieldState.error?.message}
                    </span>
                    <textarea
                      rows={3}
                      maxLength={FEEDBACK_MAX_LENGTH}
                      className="h-[150px]  w-full rounded-lg border-border bg-foreground text-sm placeholder:text-muted focus:border-0 focus:ring-border "
                      placeholder={t("course_header_feedback_placeholder")}
                      {...field}
                    />
                  </>
                );
              }}
            />
          </div>
          <div className="flex w-full  items-center gap-x-3 rounded-b-md border-t border-border bg-foreground p-2">
            <div className="flex items-center justify-center gap-x-3 px-2 py-1">
              {emojis.map((emoji) =>
                selectedEmoji?.name === emoji.name ? (
                  <button
                    className="emojis-feedback-selected flex h-8 w-8 items-center justify-center rounded-full border border-primary text-lg"
                    // onClick={() => setSelectedEmoji(emoji)}
                    key={emoji.name}
                  >
                    <span>{emoji.emoji}</span>
                  </button>
                ) : (
                  <button
                    className="emojis-feedback flex h-8 w-8 items-center justify-center rounded-full border border-border text-lg"
                    onClick={() => setSelectedEmoji(emoji)}
                    key={emoji.name}
                  >
                    <span>{emoji.emoji}</span>
                  </button>
                ),
              )}
            </div>
            <div className="ml-2">
              <Button
                onClick={handleSubmit(handleCreateReview)}
                disabled={
                  typeof selectedEmoji === "undefined" &&
                  !feedbackValue.length &&
                  formState.isSubmitting
                }
              >
                {t("course_header_feedback_button")}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateFeedback;
