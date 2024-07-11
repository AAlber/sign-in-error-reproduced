import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { useTaxRates } from "../zustand";
import InclusiveSelector from "./inclusive-selector";

export default function PercentageInclusiveInput({
  setOpenTaxEditor,
}: {
  setOpenTaxEditor: (value: boolean) => void;
}) {
  const { t } = useTranslation("page");
  const { taxRatePercentage, setTaxRatePercentage, selectedInclusiveTax } =
    useTaxRates();

  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="percentage" className=" flex gap-2">
        {t("percentage")}

        <WithToolTip
          text={
            selectedInclusiveTax
              ? t("tax_rates.inclusive_explanation")
              : t("tax_rates.exclusive_explanation")
          }
        />
      </Label>

      <div className="col-span-2 flex gap-2">
        <div className="relative overflow-hidden rounded-md">
          <span className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-md border-[0.5px] border-border bg-foreground text-sm text-muted-contrast">
            %
          </span>
          <Input
            type="text"
            id="percentage"
            className=" h-8"
            placeholder="19.99"
            value={taxRatePercentage.toString()}
            onChange={(e) => {
              setTaxRatePercentage(e.target.value);
            }}
          />
        </div>
        <InclusiveSelector setOpenTaxEditor={setOpenTaxEditor} />
      </div>
    </div>
  );
}
