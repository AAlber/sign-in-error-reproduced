import { useEffect } from "react";
import useContentBlockCreator from "../../../zustand";
import { SurveyCreationQuestionsTable } from "./questions-table";
import useCustomFormSurvey from "./zustand";

const FormSurvey = () => {
  const { questions, setQuestions } = useCustomFormSurvey();
  const { setData, contentBlockType, isOpen, data } = useContentBlockCreator();

  useEffect(() => {
    if (contentBlockType !== "Survey") return;
    setData<"Survey">({
      isAnonymous: data.isAnonymous,
      questions: questions,
    });
  }, [questions]);

  useEffect(() => {
    if (contentBlockType !== "Survey") return;
    if (isOpen) {
      setQuestions([]);
    }
  }, [isOpen]);

  return (
    <div className="col-span-full flex flex-col gap-2">
      <SurveyCreationQuestionsTable />
    </div>
  );
};

export default FormSurvey;
