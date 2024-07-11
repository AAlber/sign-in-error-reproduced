import { useTranslation } from "react-i18next";

export default function AddTaxRateHeader() {
  const { t } = useTranslation("page");
  return (
    <div className="space-y-1">
      <h4 className="font-medium leading-none">{t("tax_rates.add_title")}</h4>
      <p className="text-sm text-muted-contrast">
        {t("tax_rates.add_description")}
      </p>
    </div>
  );
}
