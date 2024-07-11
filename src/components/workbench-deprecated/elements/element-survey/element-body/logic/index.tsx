import { useTranslation } from "react-i18next";
import type { SurveyLogic } from "../..";
import LogicActionContent from "./logic-action-content";
import ActionTypeSelector from "./logic-action-type-selector";
import ConditionSelector from "./logic-condition-menu";
import DeleteLogicButton from "./logic-delete-button";
import LogicThresholdInput from "./logic-threshold-input";

export default function Logic(props: {
  elementId: string;
  index: number;
  logic: SurveyLogic;
}) {
  const { elementId, index, logic } = props;
  const { t } = useTranslation("page");
  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-2 rounded-md border border-border bg-foreground py-2 pl-3 pr-5 text-muted-contrast ">
      <DeleteLogicButton elementId={elementId} logic={logic} />
      <div className="flex items-center font-medium text-contrast">
        {t("workbench.sidebar_element_survey_logic")} {index + 1}:
      </div>{" "}
      <div className="flex items-center">
        {t("workbench.sidebar_element_survey_logic_condition")}
      </div>
      <ConditionSelector elementId={elementId} logic={logic} />
      <LogicThresholdInput elementId={elementId} logic={logic} />
      <div className="flex items-center">
        {t("workbench.sidebar_element_survey_logic_then")}
      </div>
      <ActionTypeSelector elementId={elementId} logic={logic} />
      <LogicActionContent elementId={elementId} logic={logic} />
    </div>
  );
}
