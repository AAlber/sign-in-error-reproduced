import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleTaxRateSubmit } from "@/src/client-functions/client-paid-access-pass/tax-rates";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import AddTaxRateHeader from "./add-tax-rate-header";
import CountrySelector from "./country-selector";
import CustomNameInput from "./custom-name-input";
import PercentageInclusiveInput from "./percentage-inclusive-input";
import TaxTypeSelector from "./tax-type-selector";

export default function CreateTaxRatePopover({ title }: { title?: string }) {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)}>
        <Button type="button" className="flex gap-2">
          <Plus className={"h-4 w-4 font-semibold"} />
          {title ?? t("tax_rates.add_title")}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="ml-3 mt-7 w-[350px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await handleTaxRateSubmit(setOpen);
            setLoading(false);
          }}
          className="grid gap-4"
        >
          <AddTaxRateHeader />
          <div className="grid gap-2">
            <TaxTypeSelector />
            <CustomNameInput />
            <CountrySelector />
            <PercentageInclusiveInput setOpenTaxEditor={setOpen} />
            <div className="flex justify-end">
              <Button type="submit">
                {loading ? t("general.loading") : t("general.create")}
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
