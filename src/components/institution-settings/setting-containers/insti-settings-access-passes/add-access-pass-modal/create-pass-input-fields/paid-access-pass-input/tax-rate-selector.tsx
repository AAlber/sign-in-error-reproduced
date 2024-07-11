import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import { useTaxRates } from "../../../tax-rates/zustand";
import TaxRateEmptyState from "./tax-rate-empty-state";

export default function TaxRateSelector({
  taxRate,
  setTaxRate,
}: {
  taxRate?: Stripe.TaxRate;
  setTaxRate: (taxRate: Stripe.TaxRate) => void;
}) {
  const { taxRates } = useTaxRates();
  const { t } = useTranslation("page");
  useEffect(() => {
    if (taxRates.length > 0 && taxRates[0]) return setTaxRate(taxRates[0]);
  }, []);
  useEffect(() => {
    if (taxRates.length === 1 && taxRates[0]) return setTaxRate(taxRates[0]);
  }, [taxRates]);
  return (
    <>
      <div className="pt-2 text-sm text-contrast ">{t("tax_rate")}</div>

      {
        <AsyncSelect
          placeholder={"tax_rate_selector_no_rates_to_select"}
          emptyState={<TaxRateEmptyState size="small" />}
          fetchData={() => Promise.resolve(taxRates)}
          onSelect={(item) => {
            setTaxRate(item);
          }}
          searchValue={(item) =>
            item.display_name +
            " (" +
            item.percentage +
            "%, " +
            (item.inclusive ? t("inclusive_short") : t("exclusive_short")) +
            ")" +
            item.id
          }
          itemComponent={(item) => (
            <TruncateHover
              text={
                item.display_name +
                " (" +
                item.percentage +
                "%, " +
                (item.inclusive ? t("inclusive_short") : t("exclusive_short")) +
                ")"
              }
              truncateAt={37}
            />
          )}
          openWithShortcut={false}
          trigger={
            <Button>
              {taxRate
                ? `${taxRate?.country} ${taxRate?.percentage}%` +
                  ` (${
                    taxRate?.inclusive
                      ? t("inclusive_short")
                      : t("exclusive_short")
                  })`
                : t("select_tax_rate")}
            </Button>
          }
        />
      }
    </>
  );
}
