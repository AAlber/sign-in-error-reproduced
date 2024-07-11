import { useTranslation } from "react-i18next";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import Spinner from "@/src/components/spinner";
import ControlledInput from "../../components/controlled-input";
import useWorkbench from "../../zustand";
import useWorkbenchGenerationStatus from "../../zustand-ai";

type HeadingField = { heading: string };

export default function ElementBody(elementId) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const heading = getElementMetadata(elementId).heading ?? "";

  const { isElementGenerating } = useWorkbenchGenerationStatus();
  const { t } = useTranslation("page");

  const { control, handleSubmit } = useCustomForm({
    formProps: {
      defaultValues: {
        heading,
      },
    },
    elementId,
    key: "heading",
    onSubmitHandler: handleUpdateMeta,
  });

  function handleUpdateMeta(value: HeadingField) {
    if (areObjectsValueEqual({ heading: value.heading }, { heading })) return;
    updateElementMetadata(elementId, { heading: value.heading });
  }

  const className =
    "flex w-full select-auto items-end justify-start bg-transparent text-3xl font-bold text-contrast outline-none placeholder:text-muted  border-none p-0 focus:!ring-0 resize-none";

  return (
    <div className="flex w-full items-center gap-4">
      {isElementGenerating(elementId) && <Spinner size="w-8 h-8" />}
      <ControlledInput
        control={control}
        name="heading"
        type="textarea"
        textareaProps={{
          className,
          disabled: mode > 0,
          onBlur: handleSubmit(handleUpdateMeta),
          placeholder: t("workbench.sidebar_element_heading_input_placeholder"),
        }}
      />
    </div>
  );
}
