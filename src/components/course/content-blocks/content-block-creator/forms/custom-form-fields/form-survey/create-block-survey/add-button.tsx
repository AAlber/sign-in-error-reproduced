import cuid from "cuid";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useCustomFormSurvey from "../zustand";
import useSurveyCreation from "./zustand";

export const SurveyAddButton = () => {
  const { t } = useTranslation("page");
  const { setQuestions, questions, setOpen } = useCustomFormSurvey();
  const { questionText, questionType, answers, reset, setAwnsers } =
    useSurveyCreation();

  const handleAddClick = () => {
    if (questionType === "selection") {
      setAwnsers([...answers, { id: cuid(), text: "" }]);
    } else {
      addQuestion();
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: cuid(),
        question: questionText,
        type: questionType,
        options: answers,
      },
    ]);
    setOpen(false);
    reset();
  };

  return (
    <div>
      {questionType === "text" ? (
        <div className="flex w-full items-center justify-end">
          <Button
            className="flex"
            variant={"cta"}
            onClick={addQuestion}
            disabled={!questionText}
          >
            {t("general.create")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Button
            variant={"default"}
            onClick={handleAddClick}
            className="w-full"
          >
            <Plus className="mr-1 size-4" />
            {"Option"}
          </Button>
          <Button variant={"cta"} onClick={addQuestion} className="w-full">
            {t("general.create")}
          </Button>
        </div>
      )}
    </div>
  );
};
