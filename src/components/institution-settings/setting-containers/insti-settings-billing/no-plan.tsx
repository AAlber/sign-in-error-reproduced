import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { createSubscription } from "@/src/client-functions/client-stripe";
import { isTestInstitution } from "@/src/client-functions/client-stripe/data-extrapolation";
import { getPricingModel } from "@/src/client-functions/client-stripe/price-id-manager";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "@/src/zustand/user";
import { SettingId } from "../../tabs";
import PlanSelector from "./plan-selector";
import DefaultPlanSelector from "./plan-selector/default-plan-selector";
import { PriceSummary } from "./plan-selector/price-summary";
import { usePlanSelector } from "./plan-selector/zustand";
import { PaymentStage, useBilling } from "./zustand-billing";

export default function NoPlan() {
  const { setPaymentStage } = useBilling();
  const { billingPeriod, userAmount, supportPackage } = usePlanSelector();
  const isMonthly = billingPeriod === "monthly";
  const { user } = useUser();
  const { t } = useTranslation("page");
  const router = useRouter();

  return (
    <SettingsSection
      title={"billing_page.create_plan.title"}
      subtitle={
        isTestInstitution()
          ? "billing_page.create_plan.subtitle1"
          : "billing_page.create_plan.subtitle2"
      }
      noFooter
      additionalButton={
        isTestInstitution() ? (
          <Button
            onClick={() => {
              setPaymentStage(PaymentStage.PlanAlreadyPurchased);
            }}
          >
            {t("billing_page.create_plan.back_button")}
          </Button>
        ) : (
          <></>
        )
      }
    >
      <DefaultPlanSelector peekDirection="left">
        <PriceSummary>
          <PriceSummary.Plan />
          <PriceSummary.Support />
          <PriceSummary.Total />
        </PriceSummary>
        <PlanSelector.TermsAndConditions />
        <PlanSelector.Confirmation
          onClick={async () => {
            const sessionUrl = await createSubscription({
              standardSubscriptionItem: {
                priceId: getPricingModel(userAmount, isMonthly)!,
                quantity: userAmount as number,
              },
              supportPackagePriceId:
                supportPackage === "none" ? undefined : supportPackage,
              success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}?page=ORGANIZATION_SETTINGS&tab=${SettingId.Billing}&state=success`,
              institutionName: user?.institution?.name || "",
            });
            router.push(sessionUrl);
          }}
        />
      </DefaultPlanSelector>
    </SettingsSection>
  );
}
