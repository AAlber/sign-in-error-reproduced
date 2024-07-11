import { useState } from "react";
import { useTranslation } from "react-i18next";
import InfoCard from "@/src/components/reusable/infocard";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench, { WorkbenchMode } from "../../../zustand";
import { evaluateSurvey, hasAnswersAllQuestions } from "./functions";

export default function EvaluateSection({ elementId }: { elementId: string }) {
  const { t } = useTranslation("page");
  const { getElementMetadata, mode } = useWorkbench();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      {mode === WorkbenchMode.FILLOUT &&
        !getElementMetadata(elementId).evaluated && (
          <div className="mt-4 flex w-full justify-between">
            <p className="text-sm text-muted-contrast">
              Once you have answered all the questions, you can evaluate this
              survey
              <br />
              receive content based on your answers. Be careful, you can only do
              this once!
            </p>
            <Button
              variant={
                hasAnswersAllQuestions(elementId) ? "positive" : "default"
              }
              loading={loading}
              enabled={hasAnswersAllQuestions(elementId)}
              onClick={async () => {
                setLoading(true);
                await evaluateSurvey(elementId);
                setLoading(false);
              }}
            >
              {loading
                ? t("workbench.sidebar_element_survey_evaluating_button")
                : t("workbench.sidebar_element_survey_evalueate_button")}
            </Button>
          </div>
        )}
      {mode === WorkbenchMode.FILLOUT &&
        getElementMetadata(elementId).evaluated && (
          <InfoCard variant="positive" icon="✅">
            <InfoCard.Title>{t("workbench.survey.evaluated")}</InfoCard.Title>
            <InfoCard.Description>
              {t("workbench.survey.evaluated_description")}
            </InfoCard.Description>
          </InfoCard>
        )}
    </div>
  );
}
