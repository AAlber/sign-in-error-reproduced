import throttle from "lodash/throttle";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { areObjectsValueEqual } from "@/src/client-functions/client-workbench";
import ControlledInput from "../../components/controlled-input";
import useWorkbench from "../../zustand";
import Points from "./points";

type TaskValue = {
  value: string;
};

function TaskInput({ elementId, showPoints = true }) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const value = getElementMetadata(elementId).task;

  const { control, handleSubmit, watch } = useForm<TaskValue>({
    defaultValues: {
      value,
    },
  });

  useEffect(() => {
    const subscription = watch(throttledUpdate);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdate = (val: TaskValue) => {
    if (areObjectsValueEqual({ value: val.value }, { value })) return;
    updateElementMetadata(elementId, { task: val.value });
  };

  const throttledUpdate = throttle(() => {
    handleSubmit(handleUpdate)();
  }, 500);

  const { t } = useTranslation("page");

  return (
    <div
      className="mb-2 flex w-full items-start font-medium"
      onBlur={handleSubmit(handleUpdate)}
    >
      <ControlledInput
        control={control}
        name="value"
        type="textarea"
        textareaProps={{
          placeholder: t("workbench.sidebar_element_task_input_placeholder"),
          disabled: mode > 0,
          minRows: 1,
          className:
            "-ml-3 flex flex-1 select-auto resize-none items-end justify-start border-transparent bg-transparent text-lg text-contrast outline-none ring-0 placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-0 ",
        }}
      />
      {showPoints && <Points elementId={elementId} />}
    </div>
  );
}

export default React.memo(TaskInput);
