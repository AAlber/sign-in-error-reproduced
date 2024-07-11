import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import { Input } from "../../shadcn-ui/input";
import { Textarea } from "../../shadcn-ui/text-area";
import { useKeydownHandler } from "../hooks";
import { useSurveyDialog } from "../zustand";

export const SurveyDialogQuestionText = ({
  questionId,
  index,
}: {
  questionId: string;
  index: number;
}) => {
  const { t } = useTranslation("page");
  const { setAnswers, answers, carouselApi, mode, currentPage, textInput } =
    useSurveyDialog();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeydownHandler(
    (e: KeyboardEvent) => {
      //if the user is in edit mode and the current page is the index of the question and the answer is not empty
      if (mode === "edit" && currentPage === index && answers.length > 0) {
        if (e.key === "Enter" && carouselApi) {
          carouselApi.scrollNext();
        }
      }
    },
    [carouselApi],
  );

  const awnserValue = answers.find(
    (answer) => answer.questionId === questionId,
  );

  const onChanges = (e: any) => {
    const newAnswers = answers.filter(
      (answer) => answer.questionId !== questionId,
    );
    newAnswers.push({
      type: "text",
      questionId,
      answer: e.target.value,
    });
    setAnswers(newAnswers);
  };

  const onBlur = (e: any) => {
    log.context("Answered survey question", {
      questionId,
      answer: e.target.value,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (textInput === "text-area" && mode === "edit") {
        textAreaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 400);
  }, [currentPage, textInput, index]);

  return (
    <>
      {textInput === "text-area" && (
        <Textarea
          placeholder={t("cb.survey_question_text_placeholder")}
          className=" h-[200px] focus:border-primary focus:ring-0"
          value={awnserValue?.type === "text" ? awnserValue.answer : ""}
          onChange={(e) => {
            onChanges(e);
          }}
          onBlur={(e) => {
            onBlur(e);
          }}
          disabled={currentPage !== index}
          ref={textAreaRef}
        />
      )}
      {textInput === "input" && (
        <Input
          placeholder={t("cb.survey_question_text_placeholder")}
          className="h-auto focus:border-primary focus:ring-0"
          value={awnserValue?.type === "text" ? awnserValue.answer : ""}
          onChange={(e) => {
            onChanges(e);
          }}
          onBlur={(e) => {
            onBlur(e);
          }}
          disabled={currentPage !== index}
          ref={inputRef}
        />
      )}
    </>
  );
};
