import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateUser } from "@/src/client-functions/client-user";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import { changeLanguage } from "../../dashboard/navigation/primary-sidebar/user-menu/language-switcher/language-switcher";
import PlanSelector from "../../institution-settings/setting-containers/insti-settings-billing/plan-selector";
import DefaultPlanSelector from "../../institution-settings/setting-containers/insti-settings-billing/plan-selector/default-plan-selector";
import { PriceSummary } from "../../institution-settings/setting-containers/insti-settings-billing/plan-selector/price-summary";
import Onboarding from "../onboarding";
import useInstitutionOnboarding from "../zustand";

export default function StepTwo() {
  const { name, setStep, language } = useInstitutionOnboarding();
  const { user } = useUser();

  const { i18n, t } = useTranslation("page");
  const router = useRouter();
  useEffect(() => {
    updateUser({ language });
    changeLanguage(i18n, user);
    if (router.query.trial === "true") {
      setStep(3);
    }
  }, []);
  return (
    <Onboarding.Step
      description={"create-subscription-description"}
      title={replaceVariablesInString(t("create-subscription-for-x"), [name])}
    >
      <DefaultPlanSelector>
        <PriceSummary>
          <PriceSummary.Plan />
          <PriceSummary.Support />
          <PriceSummary.Total />
        </PriceSummary>
        <PlanSelector.TermsAndConditions />
        <PlanSelector.Confirmation
          onClick={async () => {
            Sentry.addBreadcrumb({ message: "onboarding - set step 3" });
            return setStep(3);
          }}
        />
      </DefaultPlanSelector>
    </Onboarding.Step>
  );
}
