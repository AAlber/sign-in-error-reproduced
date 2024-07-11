import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { areObjectsValueEqual } from "@/src/client-functions/client-workbench";
import ControlledInput from "@/src/components/workbench-deprecated/components/controlled-input";
import type { SurveyLogic } from "../..";
import { updateLogics } from "../functions";

type LogicField = {
  logic: SurveyLogic;
};

export default function LogicThresholdInput({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { t } = useTranslation("page");
  const { control, handleSubmit } = useForm<LogicField>({
    defaultValues: {
      logic,
    },
  });

  const handleUpdateLogic =
    (type: "threshold" | "threshold2") => (value: LogicField) => {
      if (areObjectsValueEqual(value.logic, logic)) return;
      updateLogics(elementId, logic.id, { [type]: value.logic[type] });
    };

  const className =
    "flex w-12 select-auto resize-none justify-start rounded-md border border-border bg-background px-2 py-1 text-right text-contrast outline-none ring-0 placeholder:text-muted focus:outline-none focus:ring-0 ";

  return (
    <>
      {logic.condition === "within range" && (
        <>{t("workbench.sidebar_element_survey_logic_condition_within_of")}</>
      )}
      <ControlledInput
        control={control}
        name="logic.threshold"
        type="input"
        inputProps={{
          maxLength: 3,
          className,
          onBlur: handleSubmit(handleUpdateLogic("threshold")),
        }}
      />

      {logic.condition === "within range" && (
        <>
          {t("workbench.sidebar_element_survey_logic_condition_within_to")}
          <ControlledInput
            control={control}
            name="logic.threshold2"
            type="input"
            inputProps={{
              maxLength: 3,
              className,
              onBlur: handleSubmit(handleUpdateLogic("threshold2")),
            }}
          />
        </>
      )}
    </>
  );
}
