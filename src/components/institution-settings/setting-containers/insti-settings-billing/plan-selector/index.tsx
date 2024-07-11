import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  toastGetSpecialOffer,
  toastUserAmountTooLow,
} from "@/src/client-functions/client-stripe/alerts";
import Form from "@/src/components/reusable/formlayout";
import { NumberInput } from "@/src/components/reusable/number-input";
import Switch from "@/src/components/reusable/settings-switches/switch";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { SupportPackagePeeker } from "@/src/components/reusable/shadcn-ui/support-package-peeker";
import { usePlanSelector } from "./zustand";

export default function PlanSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <Form>{children}</Form>
    </div>
  );
}

const TermsAndConditions = () => {
  const { t } = useTranslation("page");
  return (
    <Form.FullWidthItem>
      <dd className="mt-1 w-full text-xs text-muted-contrast">
        {t("organization_onboarding_step2.text1")}{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={"https://www.fuxam.com/privacy-software"}
          className="font-semibold underline"
        >
          {t("organization_onboarding_step2.text2")}
        </a>
      </dd>
    </Form.FullWidthItem>
  );
};

export const SupportPackageSelector = ({
  peekDirection,
}: {
  peekDirection?: "left" | "right";
}) => {
  return (
    <Form.Item label={"support_package"}>
      <SupportPackagePeeker peekDirection={peekDirection} />
    </Form.Item>
  );
};

const UserAmountInput: React.FC = () => {
  const { setUserAmount, userAmount } = usePlanSelector();
  const { t } = useTranslation("page");
  return (
    <Form.Item label={t("billing_page.plan_selector.header.title1")}>
      <NumberInput
        value={userAmount}
        setValue={setUserAmount}
        belowMinValueToast={() => toastUserAmountTooLow()}
        maxValueExceededToast={() => toastGetSpecialOffer()}
        min={3}
        max={5000}
      />
    </Form.Item>
  );
};

export const YearlyMonthlySwitch = () => {
  const { billingPeriod, setBillingPeriod } = usePlanSelector();
  const isMonthly = billingPeriod === "monthly";
  const { t } = useTranslation("page");

  return (
    <Form.Item
      label={"pay_yearly"}
      description={t("billing_page.plan_selector.switcher_text1")}
    >
      <Switch
        checked={!isMonthly}
        onChange={(checked) => {
          setBillingPeriod(checked ? "yearly" : "monthly");
          return;
        }}
      />
    </Form.Item>
  );
};

export const Confirmation = ({ onClick }: { onClick: () => Promise<void> }) => {
  const { t } = useTranslation("page");
  const { userAmount } = usePlanSelector();
  const [loading, setLoading] = useState(false);
  return (
    <Form.FullWidthItem>
      <Button
        disabled={loading || userAmount === undefined || userAmount < 3}
        onClick={async () => {
          setLoading(true);
          await onClick();
          setLoading(false);
        }}
        variant={"cta"}
      >
        {loading ? t("general.loading") : t("billing_page.create_subscription")}
      </Button>
    </Form.FullWidthItem>
  );
};

Confirmation.displayName = "Confirmation";
UserAmountInput.displayName = "UserAmountInput";
SupportPackageSelector.displayName = "SupportPackageSelector";
TermsAndConditions.displayName = "TermsAndConditions";
YearlyMonthlySwitch.displayName = "YearlyMonthlySwitch";
PlanSelector.Confirmation = Confirmation;
PlanSelector.YearlyMonthlySwitch = YearlyMonthlySwitch;
PlanSelector.TermsAndConditions = TermsAndConditions;
PlanSelector.UserAmountInput = UserAmountInput;
PlanSelector.SupportPackageSelector = SupportPackageSelector;
