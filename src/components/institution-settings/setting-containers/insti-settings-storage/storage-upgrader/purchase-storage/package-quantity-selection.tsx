import { useTranslation } from "react-i18next";
import { NumberInput } from "@/src/components/reusable/number-input";

export function QuantityInput({ value, setValue }) {
  const { t } = useTranslation("page");
  return (
    <div className="text-sm">
      <div className="text-sm text-muted-contrast">{t("general.quantity")}</div>
      <NumberInput value={value} setValue={setValue} min={1} max={10000} />
    </div>
  );
}
