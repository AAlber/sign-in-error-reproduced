import React from "react";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/reusable/shadcn-ui/radio-group";
import type { ChapterQuestionData } from "@/src/types/ai/ai-request-response.types";
import useAutoLessonChat from "../zustand";
import QuestionAnswerWrapper from "./question-answer-wrapper";

interface QuestionAnswersProps {
  questionData: ChapterQuestionData | null;
}

const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ questionData }) => {
  const { selectedAnswer, setSelectedAnswer } = useAutoLessonChat();

  if (!questionData || !questionData.enoughContentForQuestion) {
    return null;
  }

  return (
    <RadioGroup
      value={selectedAnswer?.text}
      onValueChange={(value) => {
        const selectedAnswer = {
          question: questionData.question.text,
          text: value,
          isCorrect: questionData.question.answers.find(
            (answer) => answer.text === value,
          )!.isCorrect,
        };
        setSelectedAnswer(selectedAnswer || null);
      }}
    >
      {questionData.question.answers.map((answer, index) => (
        <QuestionAnswerWrapper
          key={index}
          onClick={() => {
            const selectedAnswer = {
              question: questionData.question.text,
              text: answer.text,
              isCorrect: answer.isCorrect,
            };
            setSelectedAnswer(selectedAnswer);
          }}
        >
          <RadioGroupItem value={answer.text} id={answer.text} />
          <Label
            className="flex h-full w-full items-center justify-start text-xs font-normal"
            htmlFor={answer.text}
          >
            {answer.text}
          </Label>
        </QuestionAnswerWrapper>
      ))}
    </RadioGroup>
  );
};

export default QuestionAnswers;
