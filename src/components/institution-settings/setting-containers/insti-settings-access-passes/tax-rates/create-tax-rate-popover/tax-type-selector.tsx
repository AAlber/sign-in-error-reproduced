import { useTranslation } from "react-i18next";
import { taxTypes } from "@/src/client-functions/client-paid-access-pass/tax-rates/utils";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import { useTaxRates } from "../zustand";

export default function TaxTypeSelector() {
  const { selectedTaxType, setSelectedTaxType } = useTaxRates();

  const { t } = useTranslation("page");
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="type">{t("type")}</Label>
      <div className="col-span-2">
        <Select
          value={selectedTaxType}
          onValueChange={(value: "string") => setSelectedTaxType(value)}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {taxTypes.map((item, index) => (
                <SelectItem value={item} key={index}>
                  <TruncateHover text={item} truncateAt={20} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
