import React from "react";
import { useTranslation } from "react-i18next";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { SelectionQuestion } from "@/src/types/survey.types";
import { SurveyOverviewPieChartGraph } from "./pie-chart-graph";

const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export const SurveySelectQuestionOverview = ({
  question,
  userData,
  loading,
}: {
  question: SelectionQuestion;
  userData: ContentBlockUserStatus<"Survey">[];
  loading: boolean;
}) => {
  const { t } = useTranslation("page");
  const answerCounts = question.options.map((option) => {
    const count = userData.reduce((acc, user) => {
      const answer = user.userData?.answers.find(
        (answer) =>
          answer.questionId === question.id &&
          answer.type === "selection" &&
          answer.answerId === option.id,
      );
      return answer ? acc + 1 : acc;
    }, 0);
    return {
      name: option.text,
      value: count,
    };
  });

  const COLORS = answerCounts.map(() => randomColor()); // Cores aleatórias para cada opção

  return (
    <div className="flex h-full w-full justify-between">
      {loading ? (
        <p className="text-muted-contrast">{t("general.loading")}</p>
      ) : (
        <>
          <div className="grid h-full w-[70%] grid-cols-2 items-start gap-4">
            {question.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                {option.text}
              </div>
            ))}
          </div>
          <div className="relative h-[170px] grow">
            <SurveyOverviewPieChartGraph data={answerCounts} colors={COLORS} />
          </div>
        </>
      )}
    </div>
  );
};
