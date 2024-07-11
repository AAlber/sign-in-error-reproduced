import { CornerDownLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SurveyDialogQuestionTip = ({
  type,
}: {
  type: "text" | "selection";
}) => {
  const { t } = useTranslation("page");

  return (
    <div className="flex w-full justify-end">
      {type === "text" && (
        <p className="flex items-center gap-1 text-sm text-muted-contrast">
          {t("general.press")}
          <CornerDownLeft className="h-4 w-4" />
          {t("survey_dialog_question_tip_text")}
        </p>
      )}
      {type === "selection" && (
        <p className="text-sm text-muted-contrast">
          {t("survey_dialog_question_select_tip_text")}
        </p>
      )}
    </div>
  );
};
