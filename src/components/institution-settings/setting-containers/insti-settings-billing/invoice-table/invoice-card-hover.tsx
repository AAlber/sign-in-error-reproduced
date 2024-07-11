import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { getInvoiceHoverData } from "@/src/client-functions/client-stripe/data-extrapolation";
import classNames, {
  capitalizeFirstLetter,
} from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import { useBilling } from "../zustand-billing";

export const invoiceStatuses = {
  paid: "text-fuxam-green bg-fuxam-green/10",
  void: "text-yellow-400 bg-yellow-400/10",
  draft: "text-purple-400 bg-purple-400/10",
  open: "text-yellow-400 bg-yellow-400/10",
  uncollectible: "text-fuxam-red-400 bg-fuxam-red-400/10", // THIS NEEDS TO BE FIXED
};

export default function InvoiceCardHover(props: {
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice;
}) {
  const { invoice } = props;
  const { t } = useTranslation("page");
  const { subscription } = useBilling();
  const { statusDescription, statusTitle } = getInvoiceHoverData({
    t,
    invoice,
  });

  if (!subscription || !statusTitle) return <></>;
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger>
        {capitalizeFirstLetter(t(statusTitle))}
      </HoverCardTrigger>
      <HoverCardContent className="flex max-w-[300px] flex-col border border-border p-2 text-contrast">
        <div className="mb-2 flex w-full items-center gap-x-2 font-semibold">
          <div
            className={classNames(
              invoiceStatuses[invoice.status!],
              "flex-none rounded-full p-1",
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
          {capitalizeFirstLetter(t(statusTitle))}
        </div>
        <div className="whitespace-normal text-sm text-muted-contrast">
          {statusDescription}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
