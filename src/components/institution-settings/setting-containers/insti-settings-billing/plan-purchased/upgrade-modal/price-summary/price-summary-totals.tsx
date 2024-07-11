import type Stripe from "stripe";
import {
  getPriceSummary,
  getProrationPriceSummary,
} from "@/src/client-functions/client-stripe/data-extrapolation";
import Spinner from "@/src/components/spinner";

export default function PriceTotals(props: {
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice;
}) {
  const { subtotal, total_excluding_tax, tax, total } = props.invoice;
  if (!subtotal || !total_excluding_tax || !tax || !total)
    return <Spinner size="h-4 w-4" />;
  const priceList =
    props.invoice.lines.data.length > 1
      ? getProrationPriceSummary(props.invoice)
      : getPriceSummary(props.invoice);
  return (
    <div className="divide-y divide-border ">
      <>
        {priceList.map((item) => (
          <div key={item.name} className="relative flex justify-between py-3">
            <p className="text-sm text-contrast">{item.name}</p>
            <p className="text-sm text-contrast">{item.value}</p>
          </div>
        ))}
      </>
    </div>
  );
}
