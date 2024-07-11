/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  completeInstitutionOnboarding,
  createInstitution,
  createInstitutionWithPaymentSettings,
  createTrialSubscription,
} from "@/src/client-functions/client-institution";
import useInvitation from "../../invitation/zustand";
import FuxamBotLayoutWithBox from "../../reusable/fuxam-bot-layout-box";
import Spinner from "../../spinner";
import { useLoadingSteps } from "../use-loading-steps";
import useInstitutionOnboarding from "../zustand";

/*
    In this step the user is informed that the institution is being created.
    All the database entries are created and the user can now login.
*/

const loadingSteps = [
  "organization_onboarding_step3.text1",
  "organization_onboarding_step3.text2",
  "organization_onboarding_step3.text3",
  "organization_onboarding_step3.text4",
  "organization_onboarding_step3.text5",
  "organization_onboarding_step3.text6",
  "organization_onboarding_step3.text7",
  "organization_onboarding_step3.text8",
  "organization_onboarding_step3.text9",
];

export default function StepThree() {
  const { t } = useTranslation("page");
  const { name } = useInstitutionOnboarding();
  const router = useRouter();
  const { invite } = useInvitation();

  useEffect(() => {
    if (!router.isReady) return;
    const institutionId = router.query.institutionId as string;
    const isTrialSubscription = router.query.trial === "true";
    const paymentSettings = router.query.paymentSettings as string;
    if (institutionId) {
      Sentry.addBreadcrumb({
        message: "complete organization onboarding",
        data: { institutionId },
      });
      completeInstitutionOnboarding(institutionId);
    } else if (isTrialSubscription) {
      Sentry.addBreadcrumb({
        message: "create the organization with trial subscription",
        data: { name },
      });
      createTrialSubscription();
    } else if (paymentSettings) {
      Sentry.addBreadcrumb({
        message: "create the organization with payment settings",
        data: { paymentSettings },
      });
      createInstitutionWithPaymentSettings(paymentSettings, router);
    } else {
      Sentry.addBreadcrumb({
        message:
          "create the organization with payment settings, creates the not yet existing organization",
        data: { paymentSettings },
      });
      createInstitution({ router });
    }
  }, [router.isReady]);

  const loadingStep = useLoadingSteps(loadingSteps);

  return (
    <>
      <FuxamBotLayoutWithBox.Heading>
        <div className="flex items-center gap-2">
          {t("onboarding_create_organozation")}
          <Spinner size="w-6 md:w-7" />
        </div>
      </FuxamBotLayoutWithBox.Heading>
      <FuxamBotLayoutWithBox.Description>
        {t(loadingStep!)}
      </FuxamBotLayoutWithBox.Description>
    </>
  );
}
