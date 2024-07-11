import { Download, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { getDateOfInvoice } from "@/src/client-functions/client-stripe/data-extrapolation";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function InvoiceButtons({
  invoice,
}: {
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice;
}) {
  const dateOfNewInvoice = getDateOfInvoice(invoice);
  const { t } = useTranslation("page");
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant={"ghost"}
        onClick={() => {
          window.open(invoice.hosted_invoice_url!);
        }}
        className="flex gap-2"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={async () => {
          downloadPDF(
            "Fuxam-Invoice-" + dateOfNewInvoice + ".pdf",
            invoice.invoice_pdf!,
          );
        }}
        className="flex gap-2"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function downloadPDF(filename, pdfUrl) {
  const uniqueId = Date.now();
  const modifiedUrl =
    pdfUrl + "?filename=" + encodeURIComponent(filename + "_" + uniqueId);

  const link = document.createElement("a");
  link.setAttribute("download", "hello");
  link.download = "hello";
  link.style.display = "none";
  link.href = modifiedUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
