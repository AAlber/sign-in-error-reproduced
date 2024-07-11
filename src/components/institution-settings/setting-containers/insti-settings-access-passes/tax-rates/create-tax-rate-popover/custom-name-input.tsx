import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { useTaxRates } from "../zustand";

export default function CustomNameInput() {
  const { t } = useTranslation("page");
  const { selectedTaxType, customDisplayName, setCustomDisplayName } =
    useTaxRates();

  return selectedTaxType === "tax_rate.custom" ? (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="name">{t("name")}</Label>
      <Input
        id="label"
        className="col-span-2 h-8"
        value={customDisplayName}
        onChange={(e) => setCustomDisplayName(e.target.value)}
      />
    </div>
  ) : (
    <></>
  );
}
