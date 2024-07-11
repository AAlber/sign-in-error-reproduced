import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";

export default function PricePerUser({ info }: { info: AccessPassStatusInfo }) {
  const { accessPassPaymentInfo } = info.accessPass;
  const currency = accessPassPaymentInfo?.currency;
  const pricePerUser = accessPassPaymentInfo?.unitAmount;
  const currencySign = currency === "usd" ? "$" : "€";
  return info.accessPass.isPaid && pricePerUser ? (
    <p className={"t-primary flex h-8 items-center gap-2 text-sm"}>
      <span>{currencySign + pricePerUser / 100}</span>
    </p>
  ) : (
    <></>
  );
}
