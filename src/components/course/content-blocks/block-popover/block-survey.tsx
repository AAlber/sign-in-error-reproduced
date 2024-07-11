import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { initSurvey } from "@/src/components/reusable/survey-dialog/init-function";
import type { ContentBlock } from "@/src/types/course.types";
import type { SurveyAnswer, SurveySpecs } from "@/src/types/survey.types";
import useUser from "@/src/zustand/user";
import useContentBlockFinishedModal from "../block-finished-modal/zustand";

export const BlockSurvey = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const isBlockFinished = block.userStatus === "FINISHED";
  const [userAnswers, setUserAnswers] = useState<SurveyAnswer[]>();
  const [loading, setLoading] = useState(true);
  const { setOpen } = useContentBlockFinishedModal();

  contentBlockHandler.userStatus
    .getForUser<"Survey">({
      blockId: block.id,
      userId: user.id,
    })
    .then((userStatus) => {
      setLoading(false);
      setUserAnswers(userStatus.userData?.answers);
    });

  const updateSurveyUserData = (answers: SurveyAnswer[]) => {
    contentBlockHandler.userStatus
      .update<"Survey">({
        blockId: block.id,
        data: {
          status: "FINISHED",
          userData: {
            answers,
            answeredAt: new Date(),
          },
        },
        userId: user.id,
      })
      .then(() => {
        setOpen(true);
      });
  };

  const confirmationText = (block.specs as SurveySpecs).isAnonymous
    ? "cb.survey_finish.anoymous"
    : "cb.survey_finish.not_anoymous";

  return (
    <Button
      variant={"cta"}
      className="w-full"
      disabled={loading}
      onClick={() => {
        initSurvey({
          data: {
            questions: (block.specs as unknown as SurveySpecs).questions,
            onFinish: updateSurveyUserData,
            confirmationText: confirmationText,
            mode: isBlockFinished ? "view" : "edit",
            answers: isBlockFinished ? userAnswers : undefined,
          },
        });
      }}
    >
      {t(
        loading
          ? "general.loading"
          : isBlockFinished
          ? "general.open"
          : "cb.survey_start",
      )}
    </Button>
  );
};
