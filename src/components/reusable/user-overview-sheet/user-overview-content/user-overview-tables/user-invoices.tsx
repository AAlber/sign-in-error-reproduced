import { getUserInvoices } from "@/src/client-functions/client-stripe";
import InvoiceTable from "../../../../institution-settings/setting-containers/insti-settings-billing/invoice-table";
import { useUserOverview } from "../../zustand";

export default function UserInvoicesTable() {
  const { invoices, setInvoices, user } = useUserOverview();

  if (!user) return null;

  return (
    <InvoiceTable
      invoices={invoices}
      setInvoices={setInvoices}
      getInvoicesFn={() => getUserInvoices(user.id)}
    />
  );
}
