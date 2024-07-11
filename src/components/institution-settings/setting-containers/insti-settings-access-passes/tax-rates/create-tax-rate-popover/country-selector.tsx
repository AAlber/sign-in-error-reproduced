import { useTranslation } from "react-i18next";
import { taxCountryNames } from "@/src/client-functions/client-paid-access-pass/tax-rates/utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { useTaxRates } from "../zustand";

export default function CountrySelector() {
  const { selectedCountry, setSelectedCountry } = useTaxRates();
  const { t } = useTranslation("page");
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="country">{t("country")}</Label>
      <div className="col-span-2">
        <AsyncSelect
          placeholder={"layer_selector_placeholder"}
          noDataMessage={"layer_selector_no_layers_to_select"}
          fetchData={() => Promise.resolve(taxCountryNames)}
          onSelect={(item) => {
            setSelectedCountry(item);
          }}
          searchValue={(item) => item}
          itemComponent={(item) => <>{item}</>}
          openWithShortcut={false}
          trigger={<Button> {selectedCountry} </Button>}
        />
      </div>
    </div>
  );
}
