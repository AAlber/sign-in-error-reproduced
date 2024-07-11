import cuid from "cuid";
import Button from "@/src/components/reusable/new-button";
import useWorkbench, { WorkbenchMode } from "../../../zustand";
import type { SurveyLogic, SurveyQuestion } from "..";
import { getSumOfPoints } from "./functions";

export default function AddButtons({ elementId }: { elementId: string }) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();

  return (
    <>
      {mode === WorkbenchMode.CREATE && (
        <div className="mt-3.5 flex w-full items-center justify-between rounded-md border border-border bg-foreground py-2 pl-3 pr-5 ">
          <div className="flex items-center gap-2">
            <Button
              title="workbench.sidebar_element_survey_add_question_button"
              onClick={() => {
                const questions: SurveyQuestion[] =
                  getElementMetadata(elementId).questions || [];
                questions.push({
                  id: cuid(),
                  question: "",
                  choices: [
                    { choice: "", checked: false, points: 0 },
                    { choice: "", checked: false, points: 0 },
                  ],
                });
                updateElementMetadata(elementId, { questions });
              }}
            />
            <Button
              title="workbench.sidebar_element_survey_add_logic_button"
              palette="blue"
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
            />
          </div>
          <p className="flex items-center gap-3 text-2xl font-semibold text-contrast">
            <span className="text-lg font-normal text-muted-contrast">
              Total Points
            </span>
            {getSumOfPoints(elementId)}
          </p>
        </div>
      )}
    </>
  );
}
// this code is NOT being used anywhere ?????
