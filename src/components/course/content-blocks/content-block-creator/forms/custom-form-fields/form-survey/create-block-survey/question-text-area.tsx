import { useTranslation } from "react-i18next";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import useSurveyCreation from "./zustand";

export const QuestionTextArea = () => {
  const { t } = useTranslation("page");
  const { questionText, setQuestionText } = useSurveyCreation();

  return (
    <Textarea
      placeholder={t("cb.survey_table.text_placeholder")}
      className="min-h-[200px] focus:border-0"
      value={questionText}
      onChange={(e) => {
        setQuestionText(e.target.value);
      }}
    />
  );
};
