import { getUserInvoices } from "@/src/client-functions/client-stripe";
import type { UserData } from "@/src/types/user-data.types";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import InvoiceTable from "../../institution-settings/setting-containers/insti-settings-billing/invoice-table";
import useUserOverview from "./zustand";

export default function UserInvoicesTable({
  user,
}: {
  user: InstitutionUserManagementUser | UserData;
}) {
  const { invoices, setInvoices } = useUserOverview();

  return (
    <InvoiceTable
      invoices={invoices}
      setInvoices={setInvoices}
      getInvoicesFn={() => getUserInvoices(user.id)}
    />
  );
}
