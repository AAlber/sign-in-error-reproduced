import { useTranslation } from "react-i18next";
import useCourse from "@/src/components/course/zustand";
import InfoCard from "@/src/components/reusable/infocard";
import useWorkbench, { WorkbenchMode, WorkbenchType } from "../../../zustand";
import EvaluateSection from "./evaluate-button";
import LogicList from "./logic-list";
import QuestionList from "./question-list";

export function ElementBody(elementId) {
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();
  const { mode, workbenchType } = useWorkbench();

  return (
    <div key={elementId} className="flex w-full flex-col items-stretch">
      <QuestionList elementId={elementId} />
      <LogicList elementId={elementId} />
      {hasSpecialRole &&
        mode === WorkbenchMode.FILLOUT &&
        workbenchType == WorkbenchType.LEARNING && (
          <InfoCard icon="ℹ️">
            <InfoCard.Title>
              {t("workbench.survey.logic_visible")}
            </InfoCard.Title>
            <InfoCard.Description>
              {t("workbench.survey.logic_visible_description")}
            </InfoCard.Description>
          </InfoCard>
        )}
      <EvaluateSection elementId={elementId} />
    </div>
  );
}
