import dayjs from "dayjs";
import type Stripe from "stripe";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import InvoiceCardHover, { invoiceStatuses } from "./invoice-card-hover";

export default function InvoiceStatus({
  invoice,
}: {
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice;
}) {
  const { user } = useUser();
  dayjs.locale(user.language);
  return (
    <div className="flex items-center justify-end gap-x-2 sm:justify-start">
      <div
        className={classNames(
          invoiceStatuses[invoice.status!],
          "flex-none rounded-full p-1",
        )}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      <div className="hidden text-contrast sm:block">
        <InvoiceCardHover invoice={invoice} />
      </div>
    </div>
  );
}
