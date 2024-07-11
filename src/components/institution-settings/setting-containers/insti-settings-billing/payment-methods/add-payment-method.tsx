import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { confirmAddingPayMethod } from "@/src/client-functions/client-stripe";
import { paymentElementOptions } from "@/src/client-functions/client-stripe/utils";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { useBilling } from "../zustand-billing";

export default function AddPaymentMethod() {
  const { addPaymentMethodClientSecret } = useBilling();

  const elements = useElements();
  const stripe = useStripe();

  const [loading, setLoading] = useState(false);
  return (
    <>
      <SettingsSection
        title="billing_page.payment_methods.add_payment_method_title"
        subtitle={"billing_page.payment_methods.add_payment_method_subtitle"}
        footerButtonText={
          loading
            ? "billing_page.payment_methods.add_payment_method_footer_button1"
            : "billing_page.payment_methods.add_payment_method_footer_button2"
        }
        footerButtonDisabled={false}
        footerButtonAction={async () => {
          setLoading(true);
          if (addPaymentMethodClientSecret) {
            await confirmAddingPayMethod(
              elements,
              stripe,
              addPaymentMethodClientSecret,
              false,
            );
          }
          setLoading(false);
        }}
      >
        <PaymentElement id="payment-element" options={paymentElementOptions} />
      </SettingsSection>
    </>
  );
}
