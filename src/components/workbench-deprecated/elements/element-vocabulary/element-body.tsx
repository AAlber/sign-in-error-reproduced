import { X } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import ControlledInput from "../../components/controlled-input";
import type { Metadata } from "../../types";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import TaskInput from "../misc/task-input";

type WordsField = { words: Metadata["words"] };

export function ElementBody(elementId: string) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const words = getElementMetadata(elementId).words ?? [];
  const { t } = useTranslation("page");

  const { control, handleSubmit, watch } = useCustomForm<WordsField>({
    formProps: {
      defaultValues: {
        words,
      },
    },
    elementId,
    key: "words",
    onSubmitHandler: handleUpdateMeta,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "words" });

  const watchedWords = watch("words");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchedWords[index],
    };
  });

  function handleUpdateMeta(value: WordsField) {
    if (areObjectsValueEqual(value.words, words)) {
      // Avoid unnecessary rerender
      return;
    }

    updateElementMetadata(elementId, { words: value.words });
  }

  const className =
    "flex w-full select-auto resize-none items-end justify-start rounded-md border border-border bg-foreground px-3 text-contrast outline-none ring-0 placeholder:text-muted focus:outline-none focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div
      className="flex w-full flex-col items-start"
      onBlur={handleSubmit(handleUpdateMeta)}
    >
      <TaskInput elementId={elementId} />
      {controlledFields.map((field, index) => {
        return (
          <div
            key={field.id}
            className="my-1 flex w-full flex-row items-center justify-start gap-x-1"
          >
            <div className="flex w-full items-center gap-3">
              <ControlledInput
                control={control}
                name={`words.${index}.word`}
                type="textarea"
                textareaProps={{
                  placeholder: "Word",
                  disabled: mode !== WorkbenchMode.CREATE,
                  className,
                }}
              />
              <ControlledInput
                control={control}
                name={`words.${index}.answer`}
                type="textarea"
                textareaProps={{
                  placeholder: "Answer",
                  disabled: mode !== WorkbenchMode.FILLOUT,
                  className,
                }}
              />
            </div>
            {mode === WorkbenchMode.CREATE && (
              <button
                onClick={() => {
                  remove(index);
                }}
                className="ml-2 text-offwhite-5 hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      })}
      {mode === WorkbenchMode.CREATE && (
        <button
          onClick={() => {
            append({ answer: "", word: "" });
          }}
          className="mt-3.5 w-full text-right text-primary hover:opacity-70"
        >
          {t("workbench.sidebar_element_vocabulary_add")}
        </button>
      )}
    </div>
  );
}
