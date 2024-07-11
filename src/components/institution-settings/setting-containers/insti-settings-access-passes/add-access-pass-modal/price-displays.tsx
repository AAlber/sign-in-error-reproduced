import { useTranslation } from "react-i18next";
import {
  getAccessPassDetails,
  getNameOfPass,
} from "@/src/client-functions/client-access-pass/utils";
import PriceDisplay from "../../insti-settings-billing/plan-selector/price-display";
import { useAccessPassCreator } from "./zustand";

export default function CreateAccessPassButton() {
  const {
    priceForUser,
    description,
    isPaid,
    name,
    priceId,
    taxRate,
    currency,
  } = useAccessPassCreator();
  const details = getAccessPassDetails(priceId);
  const { t } = useTranslation("page");
  if (!isPaid)
    return (
      <div className="mt-[30px]">
        <PriceDisplay
          title={getNameOfPass(priceId)}
          price={details?.price as string}
          descriptionText={`${t(
            "per_user",
          )} / ${details?.billingPeriodFormatted}`}
          showBadge
          badgeText="plus_19_tax"
          badgeColor="gray"
        />
      </div>
    );
  return (
    <div className="mt-[70px] flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-contrast">
          {t("for_your_organization")}
        </p>
        <PriceDisplay
          title={getNameOfPass(priceId)}
          price={details?.price as string}
          descriptionText={`${t(
            "per_user",
          )} / ${details?.billingPeriodFormatted}`}
          showBadge
          badgeText="plus_19_tax"
          badgeColor="gray"
        />
      </div>
      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-contrast">{t("for_your_members")}</p>
        <PriceDisplay
          price={priceForUser ? priceForUser?.toString() : "100.00"}
          title={name === "" ? t("title") : name}
          descriptionText={description === "" ? t("description") : description}
          showBadge={taxRate && !taxRate?.inclusive}
          badgeText={"+" + taxRate?.percentage + "% " + t("access_pass.tax")}
          badgeColor="gray"
          currency={currency}
        />
      </div>
    </div>
  );
}
