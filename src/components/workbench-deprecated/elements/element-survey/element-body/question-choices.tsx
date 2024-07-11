import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { useFieldArray, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useWorkbench, {
  WorkbenchMode,
} from "@/src/components/workbench-deprecated/zustand";
import ChoiceOption from "../../misc/choice-item";
import type { QuestionsField } from "./question-list";

const QuestionChoices = (props: {
  control: Control<QuestionsField>;
  elementId: string;
  index: number;
  getValue: UseFormGetValues<QuestionsField>;
  setValue: UseFormSetValue<QuestionsField>;
}) => {
  const { control, elementId, index, getValue, setValue } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.choices`,
  });

  const { mode, updateElementMetadata } = useWorkbench();
  const { questions } = useWatch({ control });

  const { t } = useTranslation("page");

  const questionIndex = questions?.[index];

  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...questionIndex?.choices?.[index],
  }));

  const otherProps =
    mode === WorkbenchMode.CREATE
      ? { displayPoints: true as const, setValue }
      : {};

  const handleUpdateMeta = (idx: number) => () => {
    if (mode !== WorkbenchMode.FILLOUT) return;
    let values = getValue();
    values.questions[index]?.choices.forEach((_i, idx_) => {
      setValue(
        `questions.${index}.choices.${idx_}.checked`,
        idx_ !== idx
          ? false
          : !!!values.questions[index]?.choices[idx]?.checked,
      );
    });

    values = getValue();
    updateElementMetadata(elementId, { questions: values.questions });
  };

  return (
    <>
      {controlledFields.map((field, choiceIndex) => {
        return (
          <ChoiceOption
            key={field.id}
            checked={field.checked}
            control={control}
            index={choiceIndex}
            onUpdate={handleUpdateMeta(choiceIndex)}
            roundedCheckboxes={true}
            inputCheckboxName={`questions.${index}.choices.${choiceIndex}.checked`}
            inputTextareaTitleName={`questions.${index}.choices.${choiceIndex}.choice`}
            inputTextPointsName={`questions.${index}.choices.${choiceIndex}.points`}
            onRemove={() => {
              remove(choiceIndex);
              handleUpdateMeta(choiceIndex)();
            }}
            {...otherProps}
          />
        );
      })}
      {mode === WorkbenchMode.CREATE && (
        <button
          onClick={() => {
            append({ checked: false, choice: "", points: 0 });
          }}
          className="ml-1 mt-3.5 text-muted-contrast hover:text-primary"
        >
          {t("workbench.sidebar_element_survey_add")}
        </button>
      )}
    </>
  );
};

export default QuestionChoices;
