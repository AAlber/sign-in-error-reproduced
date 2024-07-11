import { X } from "lucide-react";
import { useEffect } from "react";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../shadcn-ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../shadcn-ui/carousel";
import { Dialog, DialogContent } from "../shadcn-ui/dialog";
import { useKeydownHandler } from "./hooks";
import { SurveyDialogQuestionOptions } from "./question/question-options";
import { SurveyDialogQuestionText } from "./question/question-text";
import { SurveyDialogQuestionTip } from "./question/question-tip";
import { SurveyDialogFinishStep } from "./steps/finish-step";
import { SurveyDialogNavigationButtons } from "./steps/navigation-buttons";
import { PaginationDots } from "./steps/pagination-dots";
import { SurveyStartStep } from "./steps/start-step";
import { useSurveyDialog } from "./zustand";

const SurveyDialog = () => {
  const {
    setCarouselApi,
    open,
    setAnswers,
    setMode,
    mode,
    closeModal,
    questions,
    introPage,
    answers,
  } = useSurveyDialog();

  const data = useSurveyDialog((state) => state);

  log.context("Open survey dialog", data);

  useKeydownHandler((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    if (open) {
      setAnswers(answers || []);
      setMode(mode);
    }
  }, [open]);

  return (
    <Dialog
      modal
      open={open}
      onOpenChange={() => {
        setAnswers(answers || []);
        setMode(mode);
      }}
    >
      <DialogContent className="max-w-2xl" hideCloseButton>
        <Carousel setApi={setCarouselApi} opts={{ watchDrag: false }}>
          <CarouselContent>
            {introPage && <SurveyStartStep>{introPage}</SurveyStartStep>}
            {questions.map((question, index) => (
              <CarouselItem
                key={question.id}
                className="relative flex h-[350px] w-full flex-col items-center gap-2 overflow-hidden"
              >
                {mode === "view" && (
                  <div className="absolute right-0 top-0 h-full w-full bg-transparent p-2" />
                )}
                <div className="flex h-full w-full max-w-[80%] flex-col justify-center">
                  <h1 className="pb-2">{question.question}</h1>
                  <div className="pb-4">
                    {question.type === "text" && (
                      <SurveyDialogQuestionText
                        questionId={question.id}
                        index={index + (introPage ? 1 : 0) + 1}
                      />
                    )}
                    {question.type === "selection" && (
                      <SurveyDialogQuestionOptions
                        questionId={question.id}
                        options={question.options}
                        index={index + (introPage ? 1 : 0) + 1}
                      />
                    )}
                  </div>
                  {mode === "edit" && (
                    <SurveyDialogQuestionTip type={question.type} />
                  )}
                </div>
              </CarouselItem>
            ))}
            {mode === "edit" && (
              <CarouselItem key={"finish"}>
                <SurveyDialogFinishStep />
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="relative flex items-center justify-start pt-4">
            <SurveyDialogNavigationButtons />
            <PaginationDots />
          </div>
        </Carousel>
        <Button
          variant={"ghost"}
          className="fixed right-1 top-1 z-20"
          onClick={() => {
            closeModal();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDialog;
