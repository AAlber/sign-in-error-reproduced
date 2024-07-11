import { useTranslation } from "react-i18next";
import type { UserWithPeerFeedback } from "@/src/client-functions/client-peer-feedback";
import { getPeerFeedbackGivenToUser } from "@/src/client-functions/client-peer-feedback";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";
import useCourse from "../zustand";
import usePeerFeedbackStore from "./zustand";

export default function OpenDialogButton({
  user,
}: {
  user: UserWithPeerFeedback;
}) {
  const {
    loadingFeedbackGiven,
    setLoadingFeedbackGiven,
    setIsOpen,
    setUserWithPeerFeedback,
    setRating,
    setFeedback,
  } = usePeerFeedbackStore();
  const { course } = useCourse();
  const { user: currentUser } = useUser();
  const { t } = useTranslation("page");

  const hasReviewed =
    user.feedbacks.find((f) => f.reviewerId === currentUser.id) !== undefined;

  return (
    <Button
      onClick={async () => {
        if (!course) return;
        setLoadingFeedbackGiven([...loadingFeedbackGiven, user.id]);
        const feedback = await getPeerFeedbackGivenToUser(
          course.layer_id,
          user.id,
          currentUser.id,
        );
        if (feedback) {
          setFeedback(feedback.text ?? "");
          setRating(feedback.rating);
        } else {
          setFeedback("");
          setRating(0);
        }
        setUserWithPeerFeedback(user);
        setIsOpen(true);
        setLoadingFeedbackGiven(
          loadingFeedbackGiven.filter((id) => id !== user.id),
        );
      }}
      className={classNames(hasReviewed && "text-muted-contrast")}
      variant={"link"}
    >
      {t(
        loadingFeedbackGiven.includes(user.id)
          ? "general.loading"
          : hasReviewed
          ? "update_feedback"
          : "give_feedback",
      )}
    </Button>
  );
}
