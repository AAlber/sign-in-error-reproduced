import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { useDiscountCreator } from "../../common-form/main-subscription-discount/zustand";

export default function PaymentBreakdown({
  userAmount,
  costPerUser,
  totalExcludingTax,
  supportPackagePrice,
  isFirstPayment,
}: {
  userAmount: number;
  costPerUser: number;
  totalExcludingTax: number;
  supportPackagePrice?: string;
  total?: number;
  isFirstPayment: boolean;
}) {
  const { type, durationInMonths, percentOff, amountOff } =
    useDiscountCreator();
  const { billingPeriod } = usePlanSelector();
  const applyDiscount =
    isFirstPayment ||
    type === "forever" ||
    (type === "repeating" &&
      ((billingPeriod === "monthly" && (durationInMonths || 0) > 1) ||
        (billingPeriod === "yearly" && (durationInMonths || 0) > 12)));
  const totalWithSupport = Number(supportPackagePrice) + totalExcludingTax;
  const totalWithTax = isFirstPayment
    ? totalWithSupport * 1.19
    : totalExcludingTax * 1.19;

  return (
    <>
      <div className="flex justify-between">
        <div className="text-sm">
          {userAmount + " Users x " + costPerUser + "€"}
        </div>
        <div className="font-semibold">{totalExcludingTax + "€"}</div>
      </div>
      {isFirstPayment && supportPackagePrice && (
        <div className="flex justify-between">
          <div className="text-sm">
            {supportPackagePrice + "€ Support + " + totalExcludingTax + "€"}
          </div>
          <div className="font-semibold">{totalWithSupport + "€"}</div>
        </div>
      )}
      <div className="flex justify-between">
        <div className="text-sm">{"+19% Tax ="}</div>
        <div className="font-semibold">{totalWithTax.toFixed(2) + "€"}</div>
      </div>
      {percentOff && applyDiscount && (
        <div className="flex justify-between">
          <div className="text-sm"> {"-" + percentOff + "% Discount ="}</div>
          <div className="font-semibold">
            {(totalWithTax * (1 - percentOff / 100)).toFixed(2) + "€"}
          </div>
        </div>
      )}
      {amountOff && applyDiscount && (
        <div className="flex justify-between">
          <div className="text-sm">{"Discount (-" + amountOff + "€)"}</div>
          <div className="font-semibold">
            {(totalWithTax - amountOff).toFixed(2) + "€"}
          </div>
        </div>
      )}
    </>
  );
}
