import classNames from "@/src/client-functions/client-utils";
import type { SelectionOption } from "@/src/types/survey.types";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../../shadcn-ui/button";
import { useKeydownHandler } from "../hooks";
import { useSurveyDialog } from "../zustand";

export const SurveyDialogQuestionOptions = ({
  questionId,
  options,
  index,
}: {
  questionId: string;
  options: SelectionOption[];
  index: number;
}) => {
  const { setAnswers, answers, mode, currentPage, carouselApi } =
    useSurveyDialog();
  const sortedOptions = options.sort((a, b) => a.text.localeCompare(b.text));

  useKeydownHandler(
    (e: KeyboardEvent) => {
      if (mode === "edit" && currentPage === index) {
        if ((e.key >= "A" && e.key <= "Z") || (e.key >= "a" && e.key <= "z")) {
          const index = e.key.toUpperCase().charCodeAt(0) - 65;
          const option = sortedOptions[index];
          if (option) {
            const newAnswers = answers.filter(
              (answer) => answer.questionId !== questionId,
            );
            newAnswers.push({
              type: "selection",
              questionId,
              answerId: option.id,
            });
            setAnswers(newAnswers);
            carouselApi?.scrollNext();
          }
        }
      }
    },
    [mode, sortedOptions, questionId, answers, setAnswers],
  );

  return (
    <div className="flex flex-col gap-2">
      {sortedOptions.map((option, index) => {
        const isSelected = answers.find(
          (answer) =>
            answer.type === "selection" &&
            answer.questionId === questionId &&
            answer.answerId === option.id,
        );

        return (
          <Button
            key={option.id}
            className={classNames(
              "flex h-auto w-full justify-start gap-2",
              isSelected && "border-primary",
            )}
            onClick={() => {
              const newAnswers = answers.filter(
                (answer) => answer.questionId !== questionId,
              );
              newAnswers.push({
                type: "selection",
                questionId,
                answerId: option.id,
              });
              setAnswers(newAnswers);
              log.context("Answered survey question", {
                questionId,
                answerId: option.id,
              });
            }}
          >
            <div
              className={classNames(
                "flex h-6 w-6 items-center justify-center rounded-md bg-muted",
                isSelected && "bg-accent",
              )}
            >
              {String.fromCharCode(65 + index)}{" "}
            </div>
            <p className="">{option.text}</p>
          </Button>
        );
      })}
    </div>
  );
};
