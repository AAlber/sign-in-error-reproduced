import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAndSetCustomerCompanyNameAndTaxId } from "@/src/client-functions/client-stripe";
import { getSubscriptionInfo } from "@/src/client-functions/client-stripe/data-extrapolation";
import PriceDisplay from "../../plan-selector/price-display";
import { useBilling } from "../../zustand-billing";

export default function PlanPrice() {
  useEffect(() => {
    getAndSetCustomerCompanyNameAndTaxId();
  }, []);
  const { t } = useTranslation("page");

  const { totalUsers } = useBilling();
  const { billingCycle, institutionSize, price } =
    getSubscriptionInfo(totalUsers);

  return (
    <div className="flex h-40 items-center justify-start border-t border-border p-10">
      <PriceDisplay
        title={"Plan " + institutionSize}
        price={price as string}
        descriptionText={t("per_user_per", {
          billingCycle: t(billingCycle as "month" | "year"),
        })}
        badgeText="plus_19_tax"
        showBadge
        badgeColor="gray"
        currency=" "
      />
    </div>
  );
}
