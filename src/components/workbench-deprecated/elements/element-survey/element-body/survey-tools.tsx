import cuid from "cuid";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench from "../../../zustand";
import type { SurveyLogic } from "..";
import { getSumOfPoints } from "./functions";

export default function SurveyTools({
  elementId,
  append,
}: {
  elementId: string;
  append: any;
}) {
  const { getElementMetadata, updateElementMetadata } = useWorkbench();

  const { t } = useTranslation("page");

  return (
    <div className="mt-3.5 flex w-full items-center justify-between rounded-md border border-border bg-foreground py-2 pl-3 pr-5 ">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            append([
              {
                choices: [
                  {
                    checked: false,
                    choice: "",
                    points: 0,
                  },
                  {
                    checked: false,
                    choice: "",
                    points: 0,
                  },
                ],
                id: cuid(),
                question: "",
              },
            ]);
          }}
        >
          {t("workbench.sidebar_element_survey_add_question")}
        </Button>
        <Button
          variant={"cta"}
          enabled={getSumOfPoints(elementId) > 0}
          onClick={() => {
            const logics: SurveyLogic[] =
              getElementMetadata(elementId).logics || [];
            logics.push({
              id: cuid(),
              threshold: 0,
              condition: "greater than",
              actionType: "open link",
              actionLink: "",
            });
            updateElementMetadata(elementId, { logics });
          }}
        >
          {t("workbench.sidebar_element_survey_add_logic")}
        </Button>
      </div>
      <p className="flex items-center gap-3 text-2xl font-semibold text-contrast">
        <span className="text-lg font-normal text-muted-contrast">
          {t("workbench.sidebar_element_survey_reachable_points")}
        </span>
        {getSumOfPoints(elementId)}
      </p>
    </div>
  );
}
