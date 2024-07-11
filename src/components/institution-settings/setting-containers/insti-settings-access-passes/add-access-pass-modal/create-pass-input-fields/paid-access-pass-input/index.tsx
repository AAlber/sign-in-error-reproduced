import type Stripe from "stripe";
import Box from "@/src/components/reusable/box";
import type { ClientStripeCurrency } from "@/src/utils/stripe-types";
import CreateTaxRatePopover from "../../../tax-rates/create-tax-rate-popover";
import { useAccessPasses } from "../../../zustand";
import DescriptionInput from "./description-input";
import MemberPaidSwitch from "./member-paid-switch";
import NameInput from "./name-input";
import PriceInput from "./price-input";
import TaxRateSelector from "./tax-rate-selector";

export type PaidAccessPassInputProps = {
  priceForUser: number | undefined;
  setPriceForUser: (value: number) => void;
  taxRate: Stripe.TaxRate | undefined;
  setTaxRate: (value: Stripe.TaxRate) => void;
  currency?: ClientStripeCurrency;
  setCurrency: (value: ClientStripeCurrency) => void;
  description: string;
  setDescription: (value: string) => void;
  isPaid: boolean;
  setIsPaid: (value: boolean) => void;
  name: string;
  setName: (value: string) => void;
};

export default function PaidAccessPassInput({
  name,
  currency,
  isPaid,
  priceForUser,
  taxRate,
  setName,
  setDescription,
  setCurrency,
  setIsPaid,
  setPriceForUser,
  setTaxRate,
  description,
}: PaidAccessPassInputProps) {
  const { accountInfo } = useAccessPasses();
  return accountInfo?.id && accountInfo.enabled ? (
    <Box smallPadding>
      <MemberPaidSwitch isPaid={isPaid} setIsPaid={setIsPaid} />
      {isPaid && (
        <>
          <div className="mt-2 flex w-full items-center gap-2 ">
            <div className="flex w-full items-center justify-between ">
              <TaxRateSelector taxRate={taxRate} setTaxRate={setTaxRate} />
            </div>
            <div>
              <CreateTaxRatePopover title="" />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <PriceInput
              priceForUser={priceForUser}
              setPriceForUser={setPriceForUser}
              currency={currency}
              setCurrency={setCurrency}
            />
          </div>
          <NameInput name={name} setName={setName} />
          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />
        </>
      )}
    </Box>
  ) : (
    <></>
  );
}
