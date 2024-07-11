import { X } from "lucide-react";
import type { Path } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import ControlledInput from "@/src/components/workbench-deprecated/components/controlled-input";
import useWorkbench, {
  WorkbenchMode,
} from "@/src/components/workbench-deprecated/zustand";
import type { SurveyQuestion } from "..";
import QuestionChoices from "./question-choices";
import SurveyTools from "./survey-tools";

export type QuestionsField = {
  questions: SurveyQuestion[];
};

export default function QuestionList({ elementId }: { elementId: string }) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const metadata = getElementMetadata(elementId);
  const questions = metadata.questions ?? [];
  const { t } = useTranslation("page");

  const { control, handleSubmit, watch, getValues, setValue } =
    useCustomForm<QuestionsField>({
      formProps: { defaultValues: { questions }, reValidateMode: "onChange" },
      elementId,
      key: "questions",
      onSubmitHandler: handleUpdateMeta,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");
  const controlledQuestions = fields.map((field, index) => ({
    ...field,
    ...watchedQuestions[index],
  }));

  function handleUpdateMeta(value: QuestionsField) {
    if (areObjectsValueEqual(value.questions, questions)) return;
    updateElementMetadata(elementId, { questions: value.questions });
  }

  return (
    <div className={"flex w-full flex-col gap-4"}>
      {controlledQuestions.map((field, index) => {
        const questionId: Path<QuestionsField> = `questions.${index}.question`;

        return (
          <div
            key={field.id}
            onBlur={handleSubmit(handleUpdateMeta)}
            className={classNames(
              "flex w-full flex-col items-start rounded-md border border-border bg-foreground px-4 py-2 ",
              metadata.evaluated &&
                "pointer-events-none select-none opacity-70 dark:opacity-70",
            )}
          >
            <div className="mb-2 flex w-full items-center px-1 font-medium">
              <ControlledInput
                control={control}
                name={questionId}
                type="textarea"
                textareaProps={{
                  placeholder: t(
                    "workbench.sidebar_element_survey_input_placeholder",
                  ),
                  disabled: mode > 0,
                  minRows: 1,
                  className:
                    "-ml-3 flex flex-1 select-auto resize-none items-end justify-start border-transparent bg-transparent text-lg text-contrast outline-none ring-0 placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-0 ",
                }}
              />
              {mode === WorkbenchMode.CREATE && (
                <button
                  onClick={() => {
                    remove(index);
                  }}
                  className="text-offwhite-5 opacity-0 hover:opacity-70 group-hover:opacity-100"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <QuestionChoices
              control={control}
              elementId={elementId}
              index={index}
              getValue={getValues}
              setValue={setValue}
            />
          </div>
        );
      })}
      {mode === WorkbenchMode.CREATE && (
        <SurveyTools elementId={elementId} append={append} />
      )}
    </div>
  );
}
