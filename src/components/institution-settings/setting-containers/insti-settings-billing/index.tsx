import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIntercom } from "react-use-intercom";
import {
  getInvoices,
  respondToLastPaymentIntentState,
  updateDefaultPaymentMethodIfNecessary,
} from "@/src/client-functions/client-stripe";
import { removeQueryParam } from "@/src/client-functions/client-utils";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import InvoiceTable from "./invoice-table";
import PaymentMethods from "./payment-methods";
import { useUpgradeModal } from "./plan-purchased/zustand";
import PlanSection from "./plan-section";
import { useBilling } from "./zustand-billing";

export default function Billing() {
  const { invoices, setInvoices, subscription, paymentMethods } = useBilling();
  const { setUpgradeModalOpen } = useUpgradeModal();
  const { show } = useIntercom();
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.state === "success") {
      respondToLastPaymentIntentState();
      removeQueryParam(router, "state");
    }
    if (router.query.fromUpgradeModal === "true") {
      subscription &&
        updateDefaultPaymentMethodIfNecessary(paymentMethods, subscription);
      setUpgradeModalOpen(true);
      removeQueryParam(router, "fromUpgradeModal");
    }
  }, [router.isReady]);
  return (
    <>
      <PlanSection />
      <SettingsSection
        title={"billing_page.invoice_table.title"}
        subtitle={"billing_page.invoice_table.subtitle"}
        footerButtonText={"contact_support"}
        footerButtonDisabled={false}
        footerButtonAction={async () => {
          show();
        }}
      >
        <InvoiceTable
          invoices={invoices}
          setInvoices={setInvoices}
          getInvoicesFn={() => getInvoices()}
        />
      </SettingsSection>
      <PaymentMethods />
    </>
  );
}
