import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { getAllTaxRates } from "@/src/client-functions/client-paid-access-pass/tax-rates";
import { getCountryNameByCode } from "@/src/client-functions/client-paid-access-pass/tax-rates/utils";
import AsyncTable from "@/src/components/reusable/async-table";
import TaxRateEmptyState from "../add-access-pass-modal/create-pass-input-fields/paid-access-pass-input/tax-rate-empty-state";
import CreateTaxRatePopover from "./create-tax-rate-popover";
import { useTaxRates } from "./zustand";

export default function TaxRateTable() {
  const { taxRates, setTaxRates } = useTaxRates();
  const { t } = useTranslation("page");
  const columns: ColumnDef<Stripe.TaxRate>[] = [
    {
      id: "name",
      header: t("name"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">{row.original.display_name}</p>
      ),
    },
    {
      id: "country",
      header: t("country"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.original.country
            ? getCountryNameByCode(row.original.country) +
              " (" +
              row.original.country +
              ")"
            : ""}
        </p>
      ),
    },
    {
      id: "percentage",
      header: t("percentage"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.original.percentage +
            "%" +
            ` (${
              row.original.inclusive
                ? t("inclusive_short")
                : t("exclusive_short")
            })`}
        </p>
      ),
    },
  ];

  return (
    <>
      <AsyncTable<Stripe.TaxRate>
        promise={getAllTaxRates}
        columns={columns}
        styleSettings={{
          showSearchBar: false,
          additionalComponent: <CreateTaxRatePopover />,
          emptyState: <TaxRateEmptyState size="normal" />,
        }}
        data={taxRates}
        setData={setTaxRates}
      />
    </>
  );
}
