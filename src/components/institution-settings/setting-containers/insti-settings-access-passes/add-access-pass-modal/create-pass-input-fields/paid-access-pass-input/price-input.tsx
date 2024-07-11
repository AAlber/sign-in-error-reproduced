import { useTranslation } from "react-i18next";
import { priceInputValidation } from "@/src/client-functions/client-paid-access-pass/utils";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { ClientStripeCurrency } from "@/src/utils/stripe-types";
import CurrencySelector from "./currency-selector";

export default function PriceInput({
  priceForUser,
  currency,
  setCurrency,
  setPriceForUser,
}: {
  priceForUser?: number;
  currency?: ClientStripeCurrency;
  setCurrency: (value: ClientStripeCurrency) => void;
  setPriceForUser: (value: number) => void;
}) {
  const { t } = useTranslation("page");
  return (
    <>
      <div className="whitespace-nowrap py-1 text-sm text-contrast">
        {t("cost")}
      </div>
      <div className=" flex h-8 gap-2 placeholder:text-muted-contrast">
        <CurrencySelector
          selectedCurrency={currency}
          setSelectedCurrency={setCurrency}
        />
        <Input
          onChange={(e) => {
            const value = priceInputValidation(e);
            setPriceForUser(value as unknown as number);
          }}
          placeholder="100.00"
          className="placeholder:text-muted-contrast"
          value={priceForUser ? priceForUser?.toString() : undefined}
        />
      </div>
    </>
  );
}
