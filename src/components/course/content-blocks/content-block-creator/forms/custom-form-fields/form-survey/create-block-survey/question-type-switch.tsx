import Switch from "@/src/components/reusable/settings-switches/switch";
import useSurveyCreation from "./zustand";

export const QuestionTypeSwitch = () => {
  const { questionType, setQuestionType } = useSurveyCreation();

  return (
    <Switch
      checked={questionType === "selection"}
      onChange={() => {
        setQuestionType(questionType === "selection" ? "text" : "selection");
      }}
    />
  );
};
