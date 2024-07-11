import { Minus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { SurveySpecs, TextQuestion } from "@/src/types/survey.types";

export const SurveyTextQuestionOverview = ({
  question,
  userData,
  block,
  loading,
}: {
  question: TextQuestion;
  userData: ContentBlockUserStatus<"Survey">[];
  block: ContentBlock<"Survey">;
  loading: boolean;
}) => {
  const { t } = useTranslation("page");
  const isAnonymous = (block.specs as SurveySpecs).isAnonymous;
  const answers = userData.map((user) => {
    const answer = user.userData?.answers.find(
      (answer) => answer.questionId === question.id && answer.type === "text",
    );
    return {
      user: user.name,
      answer: answer?.type === "text" ? answer.answer : "Not answered",
    };
  });

  return (
    <div className="flex flex-col gap-2">
      {loading || answers.length === 0 ? (
        <p className="text-start text-muted-contrast">{t("general.loading")}</p>
      ) : (
        <>
          {answers
            .filter((answer) => answer.answer !== "Not answered")
            .map((answer) => (
              <div key={answer.user} className="flex flex-col gap-px">
                <p>{answer.answer}</p>
                <p className="flex items-center gap-x-1 text-xs text-muted-contrast">
                  <Minus className="h-3 w-3" />
                  <span className="flex items-center">
                    {isAnonymous
                      ? new Array(answer.user.length).fill("*").join("")
                      : answer.user}
                  </span>
                </p>
              </div>
            ))}
          {answers.filter((answer) => answer.answer === "Not answered").length >
            0 &&
            !loading && (
              <p className="text-muted-contrast">
                {t(
                  "course.content-blocks.survey.text-question-overview.no_answers_yet",
                )}
              </p>
            )}
        </>
      )}
    </div>
  );
};
