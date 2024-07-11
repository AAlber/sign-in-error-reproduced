import type Stripe from "stripe";
import getLineItemInfo from "@/src/client-functions/client-stripe/data-extrapolation";
import { formatStripeDate } from "@/src/client-functions/client-stripe/utils";

export type CustomInvoiceLineItem = {
  description: string;
  periodStart: number;
  periodEnd: number;
  quantity: number;
  percent: number;
  inclusive: boolean;
  unitAmount: string;
  total: number;
  totalFormatted: string;
};
export default function LineItem(props: {
  invoiceLineItem?: CustomInvoiceLineItem;
  invoice?: Stripe.Invoice;
  lineItem?: Stripe.InvoiceLineItem;
  upgradeIsMonthly?: boolean;
}) {
  const {
    amount,
    description,
    inclusive,
    percent,
    periodEnd,
    periodStart,
    quantity,
    unitAmount,
  } = getLineItemInfo(props);
  return (
    <tr
      key={description}
      className="border-b border-border text-sm text-muted-contrast"
    >
      <td className="py-2 pr-8 text-contrast">
        <p className="font-semibold">{description}</p>{" "}
        <p>
          {formatStripeDate(periodStart) + " - " + formatStripeDate(periodEnd)}
        </p>
      </td>
      <td className="px-4 py-2">{quantity}</td>
      <td className="whitespace-nowrap px-4 py-2">{unitAmount}</td>
      <td className="whitespace-nowrap px-4 py-2">
        {percent + "% " + (inclusive ? "incl." : "excl.")}
      </td>
      <td className="whitespace-nowrap px-4 py-2 text-contrast">{amount}</td>
    </tr>
  );
}
