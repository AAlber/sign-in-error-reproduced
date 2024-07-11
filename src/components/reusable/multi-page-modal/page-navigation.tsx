import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "../shadcn-ui/button";
import type { MultiPageModalProps } from ".";
import { useModal } from "./zustand";

export default function ModalButtons(props: MultiPageModalProps) {
  const { step, totalSteps, setStep } = useModal();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  const nextStepUnlocked = props.pages[step - 1]?.nextStepRequirement();

  if (props.noButtons && !props.additionalButton) return null;
  if (props.noButtons && props.additionalButton)
    return (
      <div className="flex items-end justify-end">{props.additionalButton}</div>
    );

  const finishButtonDisabled =
    step === totalSteps
      ? loading ||
        !(
          nextStepUnlocked ||
          (props.useTabsInsteadOfSteps === true &&
            (props.finishButtonDisabled === null ||
              props.finishButtonDisabled === false))
        )
      : loading || !nextStepUnlocked;

  return (
    <div
      className={classNames(
        "flex items-end gap-1 text-right",
        totalSteps > 1 && props.useTabsInsteadOfSteps === false
          ? "justify-between"
          : "justify-end",
      )}
    >
      {props.useTabsInsteadOfSteps === false && totalSteps > 1 && (
        <nav
          className="flex items-center justify-center pl-1"
          aria-label="Progress"
        >
          <p className="text-sm text-muted-contrast">
            {t("multi_pages_modal.page_counter1")} {step}{" "}
            {t("multi_pages_modal.page_counter2")} {totalSteps}
          </p>
        </nav>
      )}
      <div className="flex items-center gap-2">
        {props.additionalButton}
        {totalSteps > 1 && (
          <Button
            onClick={() => {
              if (step === 1) return props.setOpen(false);
              setStep(step - 1);
            }}
          >
            {t(
              step === 1
                ? "multi_pages_modal.button_cancel"
                : "multi_pages_modal.button_back",
            )}
          </Button>
        )}
        {props.useTabsInsteadOfSteps === false &&
          totalSteps > 1 &&
          step !== totalSteps && (
            <Button
              onClick={async () => {
                const currentStep = props.pages[step - 1];
                const nextClick =
                  currentStep?.onNextClick && currentStep?.onNextClick(step);
                let canGoToNextStep = true;
                if (nextClick) {
                  setLoading(true);
                  canGoToNextStep = await nextClick;
                  setLoading(false);
                }
                canGoToNextStep && setStep(step + 1);
              }}
              disabled={loading || step >= totalSteps || !nextStepUnlocked}
              title="multi_pages_modal.button_next"
            >
              {t("multi_pages_modal.button_next")}
            </Button>
          )}
        {(step === totalSteps || props.useTabsInsteadOfSteps === true) && (
          <Button
            onClick={async () => {
              setLoading(true);
              await props.onFinish();
              setLoading(false);
              props.setOpen(false);
            }}
            disabled={finishButtonDisabled}
            title={t(loading ? "general.loading" : props.finishButtonText)}
            variant={
              props.finishButtonDanger && props.finishButtonDanger === true
                ? "destructive"
                : "cta"
            }
          >
            {t(loading ? "general.loading" : props.finishButtonText)}
          </Button>
        )}
      </div>
    </div>
  );
}
