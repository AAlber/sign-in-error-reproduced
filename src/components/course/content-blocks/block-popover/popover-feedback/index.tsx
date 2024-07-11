import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCourse from "@/src/components/course/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import Spinner from "@/src/components/spinner";
import { useFeedbackData } from "../hooks/feedback/use-feedback-data";
import { useFeedbackMutation } from "../hooks/feedback/use-feedback-mutation";
import { FeedbackTextarea } from "./feedback-text-area";
import { StarsComponent } from "./stars-component";
import { SubmitButton } from "./submit-button";

type Props = {
  blockId: string;
};

export const BlockPopoverFeedback = ({ blockId }: Props) => {
  const { course } = useCourse();
  const { feedback, queryKey } = useFeedbackData(blockId);
  const { mutateAsync, isLoading: mutateLoading } =
    useFeedbackMutation(queryKey);
  const { t } = useTranslation("page");
  const [feedbackText, setFeedbackText] = useState("");
  const [score, setScore] = useState(0);

  const fetchedScore =
    typeof feedback.data?.rating === "undefined" ? 0 : feedback.data.rating + 1;

  const fetchedFeedbackText = feedback.data?.text || "";

  useEffect(() => {
    if (!feedback.isLoading) {
      setFeedbackText(fetchedFeedbackText);
      setScore(fetchedScore);
    }
  }, [feedback.isLoading]);

  const handleClick = async () => {
    await mutateAsync({
      blockId,
      layerId: course?.layer_id ?? "",
      rating: score - 1,
      text: feedbackText,
    });
    toast.success("general.success", {
      description: "toast.feedback_success_sent",
    });
  };

  if (feedback.isLoading) return <Spinner className="m-auto" size="w-8 h-8" />;

  const noChange =
    score === fetchedScore && feedbackText === fetchedFeedbackText;

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <p className="text-sm text-muted-contrast">
        {t("course_main_content_feedbacks_text")}
      </p>
      <StarsComponent score={score} setScore={setScore} />
      <FeedbackTextarea
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
      />
      <SubmitButton
        isDisabled={mutateLoading || noChange}
        handleClick={handleClick}
        isLoading={mutateLoading}
      />
    </div>
  );
};
