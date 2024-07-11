import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import SwitchGroup from "@/src/components/reusable/settings-switches/switch-group";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ElementMetadata } from "../../types";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import { ElementType } from "../element-type";
import ChoiceOption from "../misc/choice-item";
import TaskInput from "../misc/task-input";

type ChoiceField = {
  choices: NonNullable<ElementMetadata["choices"]>;
};

export function ElementBody(elementId) {
  const {
    getElementMetadata,
    getElementsOfCurrentPage,
    updateElement,
    getElementById,
    updateElementMetadata,
    mode,
  } = useWorkbench();
  const choices = getElementMetadata(elementId).choices ?? [];
  const { t } = useTranslation("page");

  const { control, handleSubmit, watch, getValues, setValue } =
    useCustomForm<ChoiceField>({
      formProps: { defaultValues: { choices }, reValidateMode: "onChange" },
      elementId,
      key: "choices",
      ...(mode === WorkbenchMode.CREATE
        ? {
            onSubmitHandler: (val) => {
              if (areObjectsValueEqual(val.choices, choices)) return;
              updateElementMetadata(elementId, { choices: val.choices });
            },
          }
        : {}),
    });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "choices",
  });

  const watchedChoices = watch("choices");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchedChoices[index],
    };
  });

  const handleUpdateMeta = (index: number) => (value: ChoiceField) => {
    if (mode === WorkbenchMode.FILLOUT) {
      setValue(`choices.${index}.checked`, !!!value.choices[index]?.checked);
      const values = getValues("choices");
      updateElementMetadata(elementId, { choices: values });
    } else {
      if (areObjectsValueEqual(value.choices, choices)) return;
      updateElementMetadata(elementId, { choices: value.choices });
    }
  };

  return (
    <div className="flex w-full flex-col items-start">
      <TaskInput elementId={elementId} />
      {mode === WorkbenchMode.FILLOUT && (
        <p className="mb-2 text-muted-contrast">
          {t("workbench.sidebar_element_multiple_choice_description")}
        </p>
      )}
      {controlledFields.map((field, index) => {
        return (
          <ChoiceOption
            checked={field.checked}
            control={control}
            index={index}
            key={field.id}
            roundedCheckboxes={false}
            onUpdate={handleSubmit(handleUpdateMeta(index))}
            onRemove={() => {
              remove(index);
            }}
          />
        );
      })}
      {mode === WorkbenchMode.CREATE && (
        <div className="mt-3 flex w-full flex-col justify-end">
          <Button
            onClick={() => {
              append({ checked: false, text: "" });
            }}
            className="mb-3.5 ml-1 flex gap-1"
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("workbench.sidebar_element_multiple_choice_add")}
          </Button>
          <SwitchGroup>
            <SwitchItem
              label="workbench.multi_select_allowed"
              description="workbench.multi_select_allowed_description"
              checked={
                getElementById(elementId)?.type === ElementType.MULTIPLE_CHOICE
              }
              onChange={(checked) => {
                const element = getElementsOfCurrentPage().find(
                  (element) => element.id === elementId,
                );
                if (!element) return alert("Error: Element not found.");
                const updatedElement = {
                  ...element,
                  type: checked
                    ? ElementType.MULTIPLE_CHOICE
                    : ElementType.SINGLE_CHOICE,
                };
                updateElement(elementId, updatedElement);
              }}
            />
          </SwitchGroup>
        </div>
      )}
    </div>
  );
}
