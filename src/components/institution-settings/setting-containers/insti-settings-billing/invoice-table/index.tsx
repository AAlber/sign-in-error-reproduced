import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { getDateOfInvoice } from "@/src/client-functions/client-stripe/data-extrapolation";
import { formatStripeMoney } from "@/src/client-functions/client-stripe/utils";
import AsyncTable from "@/src/components/reusable/async-table";
import InvoiceButtons from "./invoice-buttons";
import InvoiceStatus from "./invoice-status";

export default function InvoiceTable({
  invoices,
  setInvoices,
  getInvoicesFn,
}: {
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[];
  setInvoices: (invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[]) => void;
  getInvoicesFn: () => Promise<(Stripe.Invoice | Stripe.UpcomingInvoice)[]>;
}) {
  const { t } = useTranslation("page");
  const columns: ColumnDef<Stripe.Invoice | Stripe.UpcomingInvoice>[] = [
    {
      id: t("billing_page.invoice_table.date"),
      header: t("billing_page.invoice_table.date"),
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium leading-6 text-contrast">
            {dayjs(getDateOfInvoice(row.original)).format("DD MMM YYYY")}
          </div>
        );
      },
    },
    {
      id: t("billing_page.invoice_table.status"),
      header: t("billing_page.invoice_table.status"),
      cell: ({ row }) => <InvoiceStatus invoice={row.original} />,
    },
    {
      id: t("billing_page.invoice_table.total_cost"),
      header: t("billing_page.invoice_table.total_cost"),
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="text-sm font-medium leading-6 text-contrast">
            {formatStripeMoney(invoice.total)}
          </div>
        );
      },
    },
    {
      id: "buttons",
      cell: ({ row }) => {
        return (
          row.original.status !== "draft" && (
            <InvoiceButtons invoice={row.original} />
          )
        );
      },
    },
  ];
  return (
    <AsyncTable<Stripe.Invoice | Stripe.UpcomingInvoice>
      promise={() => getInvoicesFn()}
      styleSettings={{
        showSearchBar: false,
        showComponentWithoutData: false,
      }}
      columns={columns}
      data={invoices}
      setData={setInvoices}
    />
  );
}
