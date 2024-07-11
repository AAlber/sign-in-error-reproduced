import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import { EmptyState } from "../../empty-state";
import { Button } from "../../shadcn-ui/button";
import { useKeydownHandler } from "../hooks";
import { useSurveyDialog } from "../zustand";

export const SurveyDialogFinishStep = () => {
  const { t } = useTranslation("page");
  const { answers, closeModal, onFinish, confirmationText, carouselApi } =
    useSurveyDialog();
  const [loading, setLoading] = useState(false);

  useKeydownHandler(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && carouselApi?.canScrollNext() === false) {
        handleFinish();
      }
    },
    [carouselApi],
  );

  const handleFinish = async () => {
    setLoading(true);
    await onFinish(answers);
    setLoading(false);
    log.context("Survey dialog finished", { answers });
    closeModal();
  };

  return (
    <EmptyState
      title={"survey_finish_title"}
      description={confirmationText!}
      icon={Send}
    >
      <Button variant={"cta"} onClick={handleFinish}>
        {t(loading ? "general.loading" : "survey_dialog_finish")}
      </Button>
    </EmptyState>
  );
};
