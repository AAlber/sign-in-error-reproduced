import type { UseAssistantHelpers } from "ai/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getQuestionForChapter } from "@/src/client-functions/client-auto-lesson";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { ChapterQuestionData } from "@/src/types/ai/ai-request-response.types";
import { finishBlock, isAssistantStreaming, isLoading } from "../functions";
import useAutoLessonChat from "../zustand";
import QuestionSkeletons from "./loading/question-skeletons";
import TitleSkeleton from "./loading/title-skeleton";
import QuestionAnswers from "./question-answers";
import { SubmitButton } from "./submit-button";

export default function UnlockNextChapterPopover({
  assistant,
}: {
  assistant: UseAssistantHelpers;
}) {
  const {
    block,
    popoverOpen,
    setPopoverOpen,
    currentChapter,
    nextChapterId,
    setNextChapterId,
  } = useAutoLessonChat();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");
  const [questionData, setQuestionData] = useState<ChapterQuestionData | null>(
    null,
  );
  const [isLastChapter, setIsLastChapter] = useState(false);

  const canUnlockNextChapter =
    assistant.messages.length > block.specs.minMessagesPerChapter;

  useEffect(() => {
    if (!block.specs.chapters[currentChapter + 1]) {
      setIsLastChapter(true);
      return;
    }
    setIsLastChapter(false);
    setNextChapterId(block.specs.chapters[currentChapter + 1]!.id);
  }, [block, currentChapter, setNextChapterId]);

  useEffect(() => {
    if (!popoverOpen || isLastChapter) return;
    setLoading(true);
    getQuestionForChapter(
      block.id,
      block.specs.chapters[currentChapter]!.id,
    ).then((res) => {
      setLoading(false);
      if (!res || !res.ok) return;
      setQuestionData(res.questionData);
    });
  }, [popoverOpen]);

  if (!block) return null;
  if (!assistant) return null;

  const handleFinishBlock = () => {
    finishBlock();
  };
  const disabledButton =
    isLoading(assistant) || isAssistantStreaming(assistant);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger disabled={!canUnlockNextChapter || disabledButton}>
        <>
          {canUnlockNextChapter && (
            <Button
              variant={"cta"}
              className={
                disabledButton ? "text-contrast" : "btn-shine text-contrast"
              }
              onClick={isLastChapter ? handleFinishBlock : undefined}
              disabled={disabledButton}
            >
              {isLastChapter
                ? t("autolesson_finish_block")
                : t("autolessom_next_chapter")}
            </Button>
          )}
        </>
      </PopoverTrigger>
      {!isLastChapter && (
        <PopoverContent className="w-[400px]">
          <p className="text-sm text-muted-contrast">
            {t("autolesson_locked_chapter")}
          </p>
          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {loading ? (
                <TitleSkeleton />
              ) : (
                <div className="font-medium">
                  {questionData && questionData!.enoughContentForQuestion ? (
                    <>{questionData!.question.text}</>
                  ) : (
                    <p className="text-destructive">
                      {t("not_enough_content_for_question")}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {loading ? (
                <QuestionSkeletons />
              ) : (
                <QuestionAnswers questionData={questionData} />
              )}
            </div>
            {!loading && <SubmitButton assistant={assistant} />}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
