import { useTranslation } from "react-i18next";
import { moneyFormatter } from "@/src/client-functions/client-stripe/utils";
import { PriceInfoItem } from "./price-info-item";

export function PriceInfo({
  subtotal,
  tax,
  total,
}: {
  subtotal: number;
  tax: number;
  total: number;
}) {
  const { t } = useTranslation("page");
  return (
    <>
      <PriceInfoItem
        label={t("general.subtotal")}
        value={"€" + moneyFormatter.format(subtotal)}
      />
      <PriceInfoItem
        label={t("general.tax")}
        value={"€" + moneyFormatter.format(tax)}
      />
      <div>
        <div className="text-sm text-muted-contrast">{t("general.total")}</div>
        <div className="text-md pt-2 font-semibold">
          {"€" + moneyFormatter.format(total)}
        </div>
      </div>
    </>
  );
}
